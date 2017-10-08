#!/usr/bin/env bash
export CMD="bash -c \"cd assets && npm install && cd ..; mix deps.unlock --all; mix deps.update --all; mix ecto.create; iex -S mix phx.server\""
docker-compose -f docker-compose-dev.yml run --rm --service-ports actor-server
