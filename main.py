from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

from logic import *
app = FastAPI()

# Модель входных данных
class HeroRequest(BaseModel):
    heroes: list[str]

# Модель ответа
class CounterPick(BaseModel):
    role: str
    name: str
    reason: str

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

# Отдаём главную страницу
@app.get("/")
async def root():
    return FileResponse("templates/index.html")

@app.post("/get-counter-picks", response_model=defaultdict(list[CounterPick]))
def get_counter_picks(request: HeroRequest):
    return create_counter_pick_dict(request.heroes)
