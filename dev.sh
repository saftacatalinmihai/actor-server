#!/usr/bin/env bash
export CMD="iex -S mix phx.server"
docker-compose -f docker-compose-dev.yml run --rm --service-ports actor-server
