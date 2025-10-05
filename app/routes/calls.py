from fastapi import APIRouter, Request

router = APIRouter()

@router.post("/incoming")
async def handle_icoming_calls(request: Request):
    return {"message":"Incoming Call Received"}