export interface DecodedToken {
  sub: string;              // Subject (généralement l'email)
  userId?: number;          // ID de l'utilisateur
  id?: number;             // Alternative pour l'ID
  role?: string;           // Rôle de l'utilisateur
  authorities?: string[];  // Liste des autorités
  scope?: string;          // Scope
  exp: number;             // Expiration timestamp
  iat: number;    // ← AJOUTER
  doctorId?: number;           // Issued at timestamp
  [key: string]: any;      // ✅ AJOUTER cette ligne pour permettre l'indexation
}