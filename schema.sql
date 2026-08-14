-- ============================================================
-- Blood Bank Digital Library - Database Schema
-- Run this in Supabase SQL Editor (Project > SQL Editor > New query)
-- ============================================================

create extension if not exists "uuid-ossp";

create table if not exists documents (
  id uuid primary key default uuid_generate_v4(),
  title_ar text not null,
  title_en text,
  department text not null,
  category text not null,
  file_type text not null,
  policy_number text,
  version text,
  effective_date date,
  revision_due date,
  tags text[] default '{}',
  file_url text not null,
  file_size_kb integer,
  uploaded_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_documents_department on documents(department);
create index if not exists idx_documents_category on documents(category);
create index if not exists idx_documents_file_type on documents(file_type);
create index if not exists idx_documents_tags on documents using gin(tags);

alter table documents add column if not exists search_vector tsvector
  generated always as (
    to_tsvector('simple', coalesce(title_ar,'') || ' ' || coalesce(title_en,'') || ' ' || coalesce(policy_number,''))
  ) stored;
create index if not exists idx_documents_search on documents using gin(search_vector);

alter table documents enable row level security;

create policy "Public read access" on documents
  for select using (true);

-- Only the service_role key (used server-side by our API routes) can insert/update/delete.
-- Create a Storage bucket named "documents" (Storage > Create bucket > Public: ON).
