import {
  getLawyerById,
  listLawyers,
  listSpecializations,
} from "@/backend/repositories/lawyer-repository";
import type { LawyerSearchFilters } from "@/types";

export async function searchLawyers(filters: LawyerSearchFilters) {
  return listLawyers(filters);
}

export async function getLawyerProfile(id: string) {
  return getLawyerById(id);
}

export async function getAllSpecializations() {
  return listSpecializations();
}
