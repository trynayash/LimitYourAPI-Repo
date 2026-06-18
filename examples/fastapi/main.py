import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from limityourapi import LimitYourAPI

app = FastAPI()
limiter = LimitYourAPI(api_key=os.getenv("LIMIT_YOUR_API_KEY", "your_api_key_here"))

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # Retrieve client identity key
    client_ip = request.client.host if request.client else "127.0.0.1"
    route = request.url.path
    
    # Evaluate decision asynchronously
    result = limiter.check(endpoint=route, identifier=client_ip)
    
    if not result.allowed:
        return JSONResponse(
            status_code=429,
            content={"error": "Too Many Requests", "retryAfter": result.retry_after},
            headers={"Retry-After": str(result.retry_after)}
        )
        
    response = await call_next(request)
    response.headers["X-RateLimit-Limit"] = str(result.limit)
    response.headers["X-RateLimit-Remaining"] = str(result.remaining)
    return response

@app.get("/items")
def read_items():
    return {"message": "Success! Route verified."}
