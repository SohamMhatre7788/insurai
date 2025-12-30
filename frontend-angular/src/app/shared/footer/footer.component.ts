import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    teamMembers = [
        { name: 'Soham Mhatre', link: 'https://www.linkedin.com/in/soham-sunil-mhatre' },
        { name: 'Srushti Gadakh', link: 'https://www.linkedin.com/in/srushti-gadakh-81796725b' },
        { name: 'Paridhi Gupta', link: 'https://www.linkedin.com/in/paridhi-gupta-968aa1293/' },
        { name: 'Rishikesh Wakchaure', link: 'https://www.linkedin.com/in/rishikesh-wakchaure-06055524b/' },
        { name: 'Sanskar More', link: 'https://www.linkedin.com/in/sanskar-more-740793232' }
    ];
}
