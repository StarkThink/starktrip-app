import { getComponentValue } from "@dojoengine/recs";
import { Entity, OverridableComponent } from "@dojoengine/recs/src/types";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { decodeString } from "./decodeString";

export const getSpaceship = (
  gameId: number,
  Spaceship: OverridableComponent,
) => {
    // Read Board
    const entityId = getEntityIdFromKeys([
        BigInt(gameId),
    ]) as Entity;
    let spaceship = getComponentValue(Spaceship, entityId);
    return spaceship;
};
