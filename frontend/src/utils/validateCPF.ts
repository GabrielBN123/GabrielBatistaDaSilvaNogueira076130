export function validarCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '');

  if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }

  const calcularDigito = (corpo: string, pesoInicial: number): number => {
    let soma = 0;
    for (let i = 0; i < corpo.length; i++) {
      soma += parseInt(corpo.charAt(i)) * (pesoInicial - i);
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const digito1 = calcularDigito(cleanCPF.substring(0, 9), 10);
  const digito2 = calcularDigito(cleanCPF.substring(0, 10), 11);

  return (
    digito1 === parseInt(cleanCPF.charAt(9)) && digito2 === parseInt(cleanCPF.charAt(10))
  );
}