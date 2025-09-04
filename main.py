from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import List, Dict
from logic import *
app = FastAPI()

# Модель входных данных
class HeroRequest(BaseModel):
    heroes: list[str]

class CounterPickResponse(BaseModel):
    counters: Dict[str, List[List[str]]]

@app.post("/get_counters", response_model=CounterPickResponse)
async def get_counter_picks(request: HeroRequest):
    return {"counters" : create_counter_pick_dict(request.heroes)}

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

# Отдаём главную страницу
@app.get("/")
async def root():
    return FileResponse("templates/index.html")

