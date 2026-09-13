"""
Supabase Management & SQL Query Utility for 11jaydymilla
Executes SQL queries directly on the Supabase PostgreSQL database via the Management API.

Usage:
  python supabase_admin.py "SELECT * FROM inquiries;"
  python supabase_admin.py "SELECT count(*) FROM inquiries;"
"""

import sys
import os
import json
import urllib.request
import urllib.error

def load_env(env_path=".env"):
    config = {}
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    config[k.strip()] = v.strip()
    return config

def execute_sql(query, project_ref=None, token=None):
    config = load_env()
    ref = project_ref or os.environ.get("SUPABASE_PROJECT_REF") or config.get("SUPABASE_PROJECT_REF")
    tok = token or os.environ.get("SUPABASE_ACCESS_TOKEN") or config.get("SUPABASE_ACCESS_TOKEN")

    if not ref or not tok:
        print("Error: SUPABASE_PROJECT_REF or SUPABASE_ACCESS_TOKEN not found.")
        sys.exit(1)

    url = f"https://api.supabase.com/v1/projects/{ref}/database/query"
    headers = {
        "Authorization": f"Bearer {tok}",
        "Content-Type": "application/json"
    }
    payload = json.dumps({"query": query}).encode("utf-8")

    req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            data = resp.read().decode("utf-8")
            if not data or data.strip() == "":
                print("Query executed successfully. (No rows returned)")
                return
            try:
                parsed = json.loads(data)
                print(json.dumps(parsed, indent=2))
            except Exception:
                print(data)
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print('Usage: python supabase_admin.py "<SQL QUERY>"')
        print('Example: python supabase_admin.py "SELECT * FROM inquiries;"')
        sys.exit(0)
    sql_query = " ".join(sys.argv[1:])
    execute_sql(sql_query)
