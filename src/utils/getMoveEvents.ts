import { DojoEvent } from "../types/DojoEvent";
import { MoveEvent } from "../types/MoveEvents";
import { getNumberValueFromEvents } from "./getNumberValueFromEvent";
import { MOVE_EVENT } from "../constants/dojoEventKeys";

export const getMoveEvent = (events: DojoEvent[]): MoveEvent => {
    // This event should be triggered from the move function in the contract
    const pos_x_event = getNumberValueFromEvents(events, MOVE_EVENT, 0);
    const pos_y_event = getNumberValueFromEvents(events, MOVE_EVENT, 1);
    const remaining_gas_event = getNumberValueFromEvents(events, MOVE_EVENT, 2);

    const result: MoveEvent = {
        pos_x: pos_x_event ?? 0,
        pos_y: pos_y_event ?? 0,
        remaining_gas: remaining_gas_event ?? 0,
    }
    return result;
};
