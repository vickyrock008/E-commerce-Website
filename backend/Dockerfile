# Stage 1: Use an official Python 3.10 slim-buster image
FROM python:3.10-slim

# Set environment variables for best practices
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Set the working directory
WORKDIR /app

# Install system dependencies
# (None needed for this app, but this is where you'd put them)

# Install Python dependencies
# Copy requirements first to leverage Docker's build cache
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy your application code into the container
# This assumes your 'app' directory is in the same folder as this Dockerfile
COPY ./app ./app

# Expose the port that uvicorn will run on
EXPOSE 8000

# Command to run the application
# Render will automatically map its external port to 8000.
# The app module is 'app.main' and the FastAPI instance is 'app'.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
