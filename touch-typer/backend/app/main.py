from fastapi import FastAPI

app = FastAPI(title="Touch Typer API")

@app.get("/")
async def root():
    return {"message": "Touch Typer API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}