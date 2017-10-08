#!/usr/bin/env bash
export CMD="mix test"
docker-compose -f docker-compose-dev.yml run --rm --service-ports actor-server
