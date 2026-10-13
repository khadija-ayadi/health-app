import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { FichePatient } from '../models/fiche-patient.model';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() {}

  generateFichePatientPDF(fiche: FichePatient): Blob {
    const doc = new jsPDF();
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = 20;

    // ===== EN-TÊTE MÉDECIN (Gauche) =====
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Dr ${fiche.prenomDoctor} ${fiche.nomDoctor}`, margin, yPosition);
    
    yPosition += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(fiche.specialiteDoctor, margin, yPosition);
    
    // ===== ADRESSE MÉDECIN (Droite) =====
    const adresseParts = fiche.adresseDoctor.split(' ');
    const ville = adresseParts[adresseParts.length - 1];
    const codePostal = adresseParts[adresseParts.length - 2];
    const rue = adresseParts.slice(0, -2).join(' ');
    
    yPosition = 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(rue, pageWidth - margin - 60, yPosition, { align: 'right' });
    yPosition += 6;
    doc.text(`${codePostal} ${ville}`, pageWidth - margin - 60, yPosition, { align: 'right' });

    // ===== TITRE PRINCIPAL =====
    yPosition = 50;
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setFont('helvetica', 'bolditalic');
    doc.text('FICHE PATIENT', pageWidth / 2, yPosition, { align: 'center' });

    // ===== LIGNE CONFIDENTIEL =====
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    
    // Ligne avant CONFIDENTIEL
    doc.line(margin + 80, yPosition, pageWidth / 2 - 35, yPosition);
    doc.text('CONFIDENTIEL', pageWidth / 2, yPosition, { align: 'center' });
    // Ligne après CONFIDENTIEL
    doc.line(pageWidth / 2 + 35, yPosition, pageWidth - margin - 80, yPosition);

    // ===== INFORMATIONS PATIENT =====
    yPosition += 20;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');

    const leftColumn = margin + 5;
    const valueColumn = leftColumn + 65;

    // Prénom et nom
    doc.text('Prénom et nom :', leftColumn, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(`${fiche.prenomPatient} ${fiche.nomPatient}`, valueColumn, yPosition);

    // Email
    yPosition += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('E-mail :', leftColumn, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(fiche.email, valueColumn, yPosition);

    // Téléphone
    yPosition += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Téléphone :', leftColumn, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(fiche.telephone, valueColumn, yPosition);

    // Date de naissance
    yPosition += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Date de naissance :', leftColumn, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(fiche.dateDeNaissance, valueColumn, yPosition);

    // Numéro de sécurité sociale
    yPosition += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Numéro sécurité so. :', leftColumn, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(fiche.numeroSecuriteSociale, valueColumn, yPosition);

    // ===== SECTION RDV =====
    yPosition += 20;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('RDV 1 - date et contenu', leftColumn, yPosition);
    doc.line(leftColumn, yPosition + 2, pageWidth - margin - 5, yPosition + 2);

    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString('fr-FR');
    doc.text(currentDate, leftColumn, yPosition);

    // ===== PIED DE PAGE =====
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Activiti', pageWidth - margin - 15, pageHeight - 15, { align: 'right' });
    doc.text('Go to app', pageWidth - margin - 15, pageHeight - 10, { align: 'right' });

    // Retourner le blob au lieu de sauvegarder
    return doc.output('blob');
  }
}