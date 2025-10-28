# 1. Base Image
# Use an official Python 3.10 slim image, as your .pyc files indicate CPython 3.10
FROM python:3.10-slim

# 2. Set Environment Variables
# Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED=1

# 3. Set Working Directory
WORKDIR /code

# 4. Install Dependencies
# Copy only the requirements file first to leverage Docker's build cache.
# This step will only re-run if requirements.txt changes.
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade pip -r requirements.txt

# 5. Copy Application Code
# Copy your entire 'app' directory into the container at /code/app
COPY ./app ./app

# 6. Expose Port
# Expose the port uvicorn will run on
EXPOSE 8000

# 7. Run the Application
# Run uvicorn. 'app.main:app' refers to the 'app' variable in your 'app/main.py' file.
# --host 0.0.0.0 makes it accessible from outside the container.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
