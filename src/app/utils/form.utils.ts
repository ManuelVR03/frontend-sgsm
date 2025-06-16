import { AbstractControl } from '@angular/forms'

export function validateDniControl (control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value !== null && validaNieNif(control.value.toUpperCase())) {
      return null
    } else {
      return { dni: true }
    }
  }
  
  export function validaNieNif (dni: string): boolean {
    const numeros: any = dni.substring(0, 8)
    if ((numeros === '11111111') || (numeros === '22222222') ||
          (numeros === '33333333') || (numeros === '44444444') ||
          (numeros === '55555555') || (numeros === '66666666') ||
          (numeros === '77777777') || (numeros === '88888888') || (dni === '00000001R') ||
          (dni === 'X0000000T')) {
      return false
    }
    if (!esNif(dni) && !esNie(dni)) {
      return false
    } else if (esNif(dni) || esNie(dni)) {
      return true
    }
    return false
  }

  export function esNif (identificador: string): boolean {
    let i: number = 0
    const letraControl: String = 'TRWAGMYFPDXBNJZSQVHLCKE'
    let esDni: boolean = true
    try {
      if (identificador.length !== 9) {
        esDni = false
      } else {
        for (i = 0; i < 8; ++i) {
          const numeros: any = identificador.substring(0, 8)
          if (isNaN(numeros) || (numeros === '11111111') || (numeros === '22222222') ||
                      (numeros === '33333333') || (numeros === '44444444') ||
                      (numeros === '55555555') || (numeros === '66666666') ||
                      (numeros === '77777777') || (numeros === '88888888')) {
            esDni = false
          } else if (identificador.charAt(8) !== letraControl.charAt((numeros % 23))) {
            esDni = false
          }
        }
      }
      return esDni
    } catch (error) {
      console.error('Ha ocurrido un error al validar el NIF:' + identificador)
      throw error
    }
  }
  
  export function esNie (identificador: string): boolean {
    let valido: boolean = true
    try {
      const letraControl: String = 'TRWAGMYFPDXBNJZSQVHLCKE'
      let valDni: any = ''
      switch (identificador.charAt(0)) {
        case 'T':
          break
        case 'U':
        case 'V':
        case 'W':
        case 'X':
          valDni = valDni + '0'
          break
        case 'Y':
          valDni = valDni + '1'
          break
        case 'Z':
          valDni = valDni + '2'
          break
        default:
          valido = false
          break
      }
  
      valDni = valDni + identificador.substring(1, 8)
      const numeros: any = identificador.substring(1, 8)
      if (identificador.charAt(8) !== letraControl.charAt(valDni % 23) || isNaN(numeros)) {
        valido = false
      }
  
      return valido
    } catch (error) {
      console.error('Ha ocurrido un error al validar el NIE:' + identificador)
      throw error
    }
  }