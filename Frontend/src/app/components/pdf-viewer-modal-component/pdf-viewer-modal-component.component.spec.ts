import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfViewerModalComponentComponent } from './pdf-viewer-modal-component.component';

describe('PdfViewerModalComponentComponent', () => {
  let component: PdfViewerModalComponentComponent;
  let fixture: ComponentFixture<PdfViewerModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfViewerModalComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfViewerModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
