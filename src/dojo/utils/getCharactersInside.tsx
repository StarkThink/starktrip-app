import { getComponentValue } from "@dojoengine/recs";
import { Entity, OverridableComponent } from "@dojoengine/recs/src/types";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { decodeString } from "./decodeString";

export const getCharactersInside = (
  gameId: number,
  len_characters: number,
  CharactersInside: OverridableComponent,
) => {
    // Read Tiles
    let result: string[] = [];
    for (let i = 0; i < len_characters; i++) {
        let charactersEntityId = getEntityIdFromKeys([
            BigInt(i), BigInt(gameId),
        ]) as Entity;
        let character = getComponentValue(CharactersInside, charactersEntityId) ?? { value: 'undefined'};
        result[i] = decodeString(character.value);
    }
    return result;
};

