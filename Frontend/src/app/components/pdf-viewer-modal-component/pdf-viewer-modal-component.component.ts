import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-viewer-modal',
  templateUrl: './pdf-viewer-modal-component.component.html',
  styleUrls: ['./pdf-viewer-modal-component.component.css']
})
export class PdfViewerModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  pdfSrc: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  openPdf(blob: Blob): void {
    const url = URL.createObjectURL(blob);
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.isOpen = true;
  }

  closeModal(): void {
    this.isOpen = false;
    this.close.emit();
    
    // Libérer l'URL du blob
    if (this.pdfSrc) {
      const url = (this.pdfSrc as any).changingThisBreaksApplicationSecurity;
      URL.revokeObjectURL(url);
      this.pdfSrc = null;
    }
  }

  downloadPdf(): void {
    if (this.pdfSrc) {
      const url = (this.pdfSrc as any).changingThisBreaksApplicationSecurity;
      const link = document.createElement('a');
      link.href = url;
      link.download = `Fiche_Patient_${new Date().getTime()}.pdf`;
      link.click();
    }
  }
}