import {type ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from "@nestjs/common";
import {ReadStream} from "fs";
import {validateFileFormat, validateFileSize} from "@/src/shared/utils/file.util";

@Injectable()
export class FileValidationPipe implements PipeTransform {
    public async transform(value: any, metadata: ArgumentMetadata) {
        if (!value.filename) {
            throw new BadRequestException('File Not Found');
        }

        const {filename, createReadStream} = value;

        const fileStream = createReadStream() as ReadStream;

        const allowedFormats = ['jpg', 'png', 'jpeg', 'webp', 'gif'];
        const isFileFormatValid = validateFileFormat(filename, allowedFormats);

        if(!isFileFormatValid){
            throw new BadRequestException('Invalid file format');
        }

        const isFileSizeValid = await validateFileSize(
            filename,
            10 * 1024 * 1024
        )

        if(!isFileSizeValid){
            throw new BadRequestException('Invalid file size. File size must be less than 10MB');
        }

        return value;
    }

}