/**
 * Verifica a força da senha baseada em critérios de segurança
 * @param password Senha a ser verificada
 * @returns Objeto contendo o nível de força e uma mensagem descritiva
 */
export interface PasswordStrengthResult {
  level: 'fraca' | 'média' | 'forte' | 'excelente';
  message: string;
  score: number; // 0-4
}

export const checkPasswordStrength = (password: string): PasswordStrengthResult => {
  if (!password) {
    return {
      level: 'fraca',
      message: 'Senha muito fraca',
      score: 0
    };
  }

  let score = 0;

  // Comprimento mínimo
  if (password.length >= 8) {
    score += 1;
  }

  // Contém letras minúsculas
  if (/[a-z]/.test(password)) {
    score += 1;
  }

  // Contém letras maiúsculas
  if (/[A-Z]/.test(password)) {
    score += 1;
  }

  // Contém números
  if (/[0-9]/.test(password)) {
    score += 1;
  }

  // Contém caracteres especiais
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }

  // Determinar o nível com base na pontuação
  if (score <= 1) {
    return {
      level: 'fraca',
      message: 'Senha fraca - adicione mais caracteres variados',
      score
    };
  } else if (score <= 2) {
    return {
      level: 'média',
      message: 'Senha média - adicione números e caracteres especiais',
      score
    };
  } else if (score <= 3) {
    return {
      level: 'forte',
      message: 'Senha forte - boa combinação de caracteres',
      score
    };
  } else {
    return {
      level: 'excelente',
      message: 'Senha excelente - combinação ideal de caracteres',
      score
    };
  }
};
