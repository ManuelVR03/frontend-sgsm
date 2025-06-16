import { Injectable } from '@angular/core';
import { AlbaranDTO } from '../modelo/AlbaranDTO';
import { AlbaranProductoDTO } from '../modelo/AlbaranProductoDTO';

@Injectable({ providedIn: 'root' })
export class PdfService {
  async generarAlbaranPDF(albaran: AlbaranDTO) {
    const pdfMake = (await import('pdfmake/build/pdfmake')).default;
    const vfsFonts = await import('pdfmake/build/vfs_fonts');
    pdfMake.vfs = vfsFonts.default;

    const base = albaran.productos?.reduce((acc, p) => acc + p.precio * Number(p.cantidad), 0) || 0;
    const iva = base * 0.21;
    const total = base + iva;

    const docDefinition = {
      content: [
        { text: 'ALBARÁN', style: 'header' },

        {
          columns: [
            [
              { text: albaran.proveedorNombre, style: 'subheader' },
              { text: `CIF: ${albaran.proveedorCif}` },
              { text: albaran.proveedorDireccion },
              { text: `Tel: ${albaran.proveedorTelefono}` },
              { text: `Email: ${albaran.proveedorEmail}` }
            ],
            [
              { text: `Nº Albarán: ${albaran.id}`, alignment: 'right' },
              { text: `Fecha: ${new Date(albaran.fechaGeneracion).toLocaleDateString()}`, alignment: 'right' }
            ]
          ]
        },

        { text: 'Cliente', style: 'subheader', margin: [0, 20, 0, 8] },
        {
          columns: [
            [
              { text: albaran.clienteNombre },
              { text: `NIF: ${albaran.clienteNif}` },
              { text: albaran.clienteDireccion }
            ]
          ]
        },

        { text: 'Productos', style: 'subheader', margin: [0, 20, 0, 8] },
        {
          table: {
            widths: ['auto', '*', 'auto', 'auto', 'auto'],
            body: [
              ['Ref.', 'Descripción', 'Cantidad', 'Precio', 'Importe'],
              ...(albaran.productos ?? []).map((p: AlbaranProductoDTO) => [
                p.referencia,
                p.descripcion,
                p.cantidad,
                `${p.precio.toFixed(2)} €`,
                `${(p.precio * Number(p.cantidad)).toFixed(2)} €`
              ])
            ]
          }
        },

        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              table: {
                body: [
                  ['Base Imponible', `${base.toFixed(2)} €`],
                  ['IVA', `${iva.toFixed(2)} €`],
                  [{ text: 'TOTAL', bold: true }, { text: `${total.toFixed(2)} €`, bold: true }]
                ]
              },
              layout: 'lightHorizontalLines'
            }
          ],
          margin: [0, 20, 0, 0]
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] }
      }
    };

    pdfMake.createPdf(docDefinition).download(`albaran_${albaran.id}.pdf`);
  }
}
