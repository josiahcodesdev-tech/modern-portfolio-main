import { test } from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { PGlite } from "@electric-sql/pglite"

test("database migration enforces admin permissions, image access and publication revisions", async () => {
  const db = new PGlite()
  const admin = "11111111-1111-4111-8111-111111111111"
  const other = "22222222-2222-4222-8222-222222222222"
  try {
    // Minimal Supabase-owned schemas; all portfolio tables/policies/functions come
    // from the real setup script, not mocked authorization implementations.
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth; create schema storage;
      create table auth.users (id uuid primary key, email text);
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema auth, storage, public to anon, authenticated;
      grant execute on function auth.uid() to anon, authenticated;
      create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
      create table storage.objects (id integer generated always as identity, bucket_id text, name text);
      alter table storage.objects enable row level security;
      grant insert on storage.objects to anon, authenticated;
      grant usage on all sequences in schema storage to anon, authenticated;
      create function storage.foldername(text) returns text[] language sql immutable as $$ select string_to_array($1, '/') $$;
      insert into auth.users values ('${admin}', 'admin@example.test'), ('${other}', 'other@example.test');
    `)
    const migration = await readFile(new URL("../supabase/setup.sql", import.meta.url), "utf8")
    await db.exec(migration)
    await db.exec(migration) // Setup is safely repeatable.
    await db.query("insert into public.portfolio_admins values ($1)", [admin])
    const publish = (revision, title = "First") => db.query("select public.publish_portfolio_content($1::jsonb, $2) as saved", [JSON.stringify({ site: { name: title }, projects: [] }), revision])
    await db.exec("set role anon")
    await assert.rejects(publish(0), error => error.code === "42501")
    await db.exec("reset role; set role authenticated")
    await db.query("select set_config('request.jwt.claim.sub', $1, false)", [other])
    await assert.rejects(publish(0), error => error.code === "42501")
    await assert.rejects(db.query("insert into public.portfolio_admins values ($1)", [other]), error => error.code === "42501")
    await assert.rejects(db.query("insert into storage.objects(bucket_id,name) values ('portfolio-media',$1)", [`${other}/image.png`]), error => error.code === "42501")
    await db.query("select set_config('request.jwt.claim.sub', $1, false)", [admin])
    const first = await publish(0)
    assert.equal(first.rows[0].saved.revision, 1)
    await assert.rejects(publish(0), error => error.code === "40001")
    assert.equal((await publish(1, "Updated")).rows[0].saved.revision, 2)
    await assert.rejects(publish(1), error => error.code === "40001")
    await assert.rejects(db.query("update public.portfolio_content set revision = 999"), error => error.code === "42501")
    await db.query("insert into storage.objects(bucket_id,name) values ('portfolio-media',$1)", [`${admin}/image.png`])
    await assert.rejects(db.query("insert into storage.objects(bucket_id,name) values ('portfolio-media',$1)", [`${other}/image.png`]), error => error.code === "42501")
    await db.exec("reset role; set role anon")
    const rows = await db.query("select content,revision from public.portfolio_content")
    assert.equal(rows.rows[0].content.site.name, "Updated")
    assert.equal(rows.rows[0].revision, 2)
    await assert.rejects(db.query("select * from public.portfolio_admins"), error => error.code === "42501")
  } finally { await db.close() }
})
