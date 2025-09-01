import os
from typing import Optional

import httpx
from fastapi import Depends, HTTPException, Request
from jose import jwt

JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET:
    raise RuntimeError("JWT_SECRET is not set")
JWT_ALG = "HS256"
DISCORD_BOT_TOKEN = os.getenv("DISCORD_BOT_TOKEN")
if not DISCORD_BOT_TOKEN:
    raise RuntimeError("DISCORD_BOT_TOKEN is not set")
STAFF_ROLE_ID = os.getenv("STAFF_ROLE_ID")
if not STAFF_ROLE_ID:
    raise RuntimeError("STAFF_ROLE_ID is not set")
_superadmins = os.getenv("SUPERADMIN_DISCORD_ID")
if not _superadmins:
    raise RuntimeError("SUPERADMIN_DISCORD_ID is not set")
SUPERADMIN_LIST = [s.strip() for s in _superadmins.split(",") if s.strip()]

async def get_current_discord_id(request: Request) -> str:
    token = request.cookies.get("session_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        return str(payload.get("discord_id"))
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid session")

async def require_staff(request: Request, guild_id: str, discord_id: str = Depends(get_current_discord_id)):
    async with httpx.AsyncClient(timeout=15.0) as client:
        member_res = await client.get(
            f"https://discord.com/api/guilds/{guild_id}/members/{discord_id}",
            headers={"Authorization": f"Bot {DISCORD_BOT_TOKEN}"}
        )
        if member_res.status_code != 200:
            raise HTTPException(status_code=403, detail="Not a guild member")
        member = member_res.json()
        role_ids = set(member.get("roles", []))
        if STAFF_ROLE_ID not in role_ids:
            raise HTTPException(status_code=403, detail="Staff role required")
    return True

async def require_superadmin(discord_id: str = Depends(get_current_discord_id)):
    if discord_id not in SUPERADMIN_LIST:
        raise HTTPException(status_code=403, detail="Superadmin required")
    return True
