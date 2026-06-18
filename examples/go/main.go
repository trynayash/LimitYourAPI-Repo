package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/trynayash/limityourapi-go"
)

func main() {
	app := fiber.New()
	apiKey := os.Getenv("LIMIT_YOUR_API_KEY")
	if apiKey == "" {
		apiKey = "your_api_key_here"
	}

	// Initialize SDK Client
	client := limityourapi.NewClient(apiKey, true)

	// Fiber middleware definition
	app.Use(func(c *fiber.Ctx) error {
		ip := c.IP()
		route := c.Path()

		decision, err := client.Check(context.Background(), route, &ip, nil)
		if err != nil {
			log.Println("Rate limiter connection error:", err)
			return c.Next() // Fail-open
		}

		c.Set("X-RateLimit-Limit", fmt.Sprintf("%d", decision.Limit))
		c.Set("X-RateLimit-Remaining", fmt.Sprintf("%d", decision.Remaining))

		if !decision.Allowed {
			c.Set("Retry-After", fmt.Sprintf("%d", decision.RetryAfter))
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error":      "Too Many Requests",
				"retryAfter": decision.RetryAfter,
			})
		}

		return c.Next()
	})

	app.Get("/data", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"message": "Success! Allowed by rate limiter."})
	})

	log.Fatal(app.Listen(":3000"))
}
