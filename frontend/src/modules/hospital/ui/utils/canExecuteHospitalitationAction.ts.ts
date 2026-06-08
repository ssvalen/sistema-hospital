import { HOSPITALITATION_RULES } from "../../types/HospitalitationRules";

import type { HospitalitationAction } from "../../types/HospitalitationActions";
import type { HospitalitationStatus } from "../../types/HospitalitationStatus";

export const canExecuteHospitalitationAction = (
    status: HospitalitationStatus,
    action: HospitalitationAction
) => {
    return HOSPITALITATION_RULES[status].includes(action);
};