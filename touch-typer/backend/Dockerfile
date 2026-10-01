FROM python:3.11-slim

WORKDIR /app

#prevents python from wiritng .pyc files
ENV PYTHONDONTWRITEBYTECODE=1 
#prevents unbuffred logging
ENV PYTHONUNBUFFERED=1  


#install dependencies 
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

#copy backend source code
COPY . .

EXPOSE 8000

#start fastapi with uvicorn auto-reload for development
CMD ["uvicorn","app.main:app","--host","0.0.0.0", "--port", "8000", "--reload"]
