from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def xd():
    return "HELLOOOOOO"