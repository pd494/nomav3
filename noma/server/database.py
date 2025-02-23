import os
from supabase import create_client

# Supabase Credentials
SUPABASE_URL = "https://ghhhqvakaajevwwsvnrc.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaGhxdmFrYWFqZXZ3d3N2bnJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNjM1ODksImV4cCI6MjA1NTgzOTU4OX0.wzG75kXIIvIIHwqV7YordXPwHrZZy-JsfPibv6HSKq8"

# Create Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
