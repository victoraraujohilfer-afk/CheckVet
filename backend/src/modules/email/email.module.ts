import { Module, Global } from '@nestjs/common';
import { EmailService } from './email.service';

@Global() // Torna o serviço disponível globalmente sem precisar importar em cada módulo
@Module({
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule { }