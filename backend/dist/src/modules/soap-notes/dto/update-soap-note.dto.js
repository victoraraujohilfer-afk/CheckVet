"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSoapNoteDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_soap_note_dto_1 = require("./create-soap-note.dto");
class UpdateSoapNoteDto extends (0, mapped_types_1.PartialType)(create_soap_note_dto_1.CreateSoapNoteDto) {
}
exports.UpdateSoapNoteDto = UpdateSoapNoteDto;
//# sourceMappingURL=update-soap-note.dto.js.map