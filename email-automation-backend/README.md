# Email Automation Backend

This is a NestJS application for the Email Automation SaaS technical test.

## Features

1.  **Campaign Scheduling**: Daily and Weekly schedules, duration, start date, timezone.
2.  **Backend API**: REST API for managing campaigns.
3.  **Automation Engine**: Cron job running every minute to process campaigns.
4.  **AI Integration**: Service to generate email content.

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run the application:
    ```bash
    npm run start:dev
    ```

## API Endpoints

*   `POST /campaigns`: Create a campaign.
*   `GET /campaigns`: List campaigns (filters: status, startDate, endDate).
*   `GET /campaigns/:id`: Get campaign details.
*   `PATCH /campaigns/:id`: Update campaign.
*   `POST /campaigns/:id/pause`: Pause campaign.
*   `POST /campaigns/:id/resume`: Resume campaign.
*   `POST /campaigns/:id/cancel`: Cancel campaign.

## Configuration

*   Database: SQLite (`db.sqlite`)
*   OpenAI API Key: Set `OPENAI_API_KEY` environment variable.

## Project Structure

*   `src/campaigns`: Campaign management (Controller, Service, Entity).
*   `src/ai`: AI integration service.
*   `src/scheduler`: Automation engine (Cron job).
