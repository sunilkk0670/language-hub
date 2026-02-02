# Plan: Hindi A2 Curriculum Implementation

This plan outlines the generation and deployment of the Hindi A2 curriculum (10 modules, 100 words each).

## 1. Objectives
- Generate 1000 unique Hindi words for the A2 level.
- Ensure **zero overlap** with the existing 1000-word A1 corpus.
- Adhere to the provided themes and focal areas.
- Include a "Liar Game" trap in each module.
- Update Firestore metadata for the A2 level.

## 2. Curriculum Structure (Modules 11-20)

| Order | Module ID | Theme | Focus Areas |
|-------|-----------|-------|-------------|
| 11 | `hi_a2_m01` | Travel & Transportation | Booking, transit modes, and stations. |
| 12 | `hi_a2_m02` | Work & Office Culture | Professional titles, tools, and office verbs. |
| 13 | `hi_a2_m03` | Education & Learning | Academic subjects, library, and university life. |
| 14 | `hi_a2_m04` | Health, Clinic & Pharmacy | Medical visits, symptoms, and anatomy. |
| 15 | `hi_a2_m05` | Leisure, Sports & Hobbies | Common games, equipment, and pastimes. |
| 16 | `hi_a2_m06` | Media, News & Internet | Digital society, social media, and journalism. |
| 17 | `hi_a2_m07` | Shopping & Fashion | Clothing types, fabrics, and mall navigation. |
| 18 | `hi_a2_m08` | Geography & Environment | Landscapes, climate issues, and sustainability. |
| 19 | `hi_a2_m09` | Public Services & City Life | Banks, post offices, and police/emergency. |
| 20 | `hi_a2_m10` | Events & Traditions | Weddings, festivals, and cultural ceremonies. |

## 3. Workflow Steps

### Phase 1: Preparation
1. Extract the current Hindi A1 word bank into a temporary reference file.
2. Verify the `audit_hindi_duplicates.js` script to handle A2 ranges.

### Phase 2: Generation & Audit (Serial Process)
For each module:
1. Generate the JSON file with 100 thematic words.
2. Run the duplicate audit against A1 + previous A2 modules.
3. Fix any overlaps immediately.
4. Verify the "Liar Game" data structure.

### Phase 3: Deployment
1. Update `upload_hindi_curriculum.js` to support A2 paths.
2. Upload all 10 modules to `languages/hindi/levels/a2/modules`.
3. Update Hindi A2 level metadata (`count: 10`, `status: Complete`, `wordCount: 1000`).

## 4. Verification
1. Run a final grand audit of all 2000 Hindi words (A1 + A2).
2. Use `verify_hindi.js` to confirm Firestore state.

---
**Status:** Awaiting Approval to start Module 11.
