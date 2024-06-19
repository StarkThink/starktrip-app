import { overridableComponent } from "@dojoengine/recs";
import { ContractComponents } from "./generated/contractComponents";

export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({
    contractComponents,
}: {
    contractComponents: ContractComponents;
}) {
    return {
        ...contractComponents,
        Board: overridableComponent(contractComponents.Board),
        CharactersInside: overridableComponent(contractComponents.CharactersInside),
        Game: overridableComponent(contractComponents.Game),
        LeaderBoard: overridableComponent(contractComponents.LeaderBoard),
        LeaderBoardPlayers: overridableComponent(contractComponents.LeaderBoardPlayers),
        Spaceship: overridableComponent(contractComponents.Spaceship),
        Tile: overridableComponent(contractComponents.Tile),
    };
}
