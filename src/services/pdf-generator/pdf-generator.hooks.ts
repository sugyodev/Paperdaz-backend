import { HooksObject } from '@feathersjs/feathers';
import {PDFDocument, rgb, scale, StandardFonts, degrees} from 'pdf-lib';
import {writeFile} from 'fs/promises';
import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs'
import fetch from 'node-fetch'
import app from '../../app';
import { DEFAULT_VALUES } from '../../utils/constants';
import BorderStyle from 'pdf-lib/cjs/core/annotation/BorderStyle';

const PdfGenerator = async (context: any)=>{
       const {pdf_url, data, pdfWidth, pdfHeight} = context.data
        const pdf = await fetch(pdf_url).then(res => res.arrayBuffer())
        
        const pdfDoc = await PDFDocument.load(pdf,{
          ignoreEncryption: true
        })
        // console.log(pdfDoc);
        let numPages:any = pdfDoc.getPages.length
        pdfDoc.getPages().map((page:any) =>{
          // page.setSize( pdfWidth, pdfHeight)
          console.log(page.getSize())
        })
        // for (let index = 0; index < pdfDoc.getPages.length; index++) {
        //   // const element = array[index];
         
        // }

        console.log("number of pages ="+(parseInt(numPages)+1))


        const form = pdfDoc.getForm()
        const fields = form.getFields()
        console.log(`${fields.length} fields found`)
        // try {
          fields.forEach(async field => {
            const type = field.constructor.name
            const name = field.getName()
            // console.log(`${type}: ${name}`)

            data.map(async (el:any) => {
              //if text
              if(el.type == "PDFTextField"){
                if(el.fieldName == name){
                  await form.getTextField(name).setText(el.value);
                  console.log(`${type}: ${name}`)
                }
              }
              else if(el.type == "PDFDropdown"){
                if(el.fieldName == name){
                  form.getDropdown(name).select(el.value);
                }
              }
              else if(el.type == "PDFCheckBox"){
                if(el.fieldName == name){
                  if(el.isCheck){
                    form.getCheckBox(name).check();
                  }
                }
              }
              else if(el.type == "PDFRadioGroup"){
                if(el.fieldName == name){
                 form.getRadioGroup(name).select(el.value)
                }
              }
            })


          })
          // loop Annotations
          data.map(async (el:any) => {
            let _page = pdfDoc.getPages()[el.page_number]; 
            if(el.type == "Annotation"){
              if(el.option === DEFAULT_VALUES.svgOption.FILL){
                _page.drawSvgPath(el.svgPath, {x: (el.axisX*_page.getWidth())/pdfWidth, y: (_page.getHeight() - (el.axisY*_page.getHeight())/pdfHeight) , color: rgb(0, 0, 0), scale: Number(el.elemScale * 1.17) },)
              }else if(el.option === DEFAULT_VALUES.svgOption.DOT){
                _page.drawSvgPath(el.svgPath, {x: (el.axisX*_page.getWidth())/pdfWidth, y:  (_page.getHeight() - (el.axisY*_page.getHeight())/pdfHeight) , color: rgb(0, 0, 0), scale: Number(el.elemScale * 0.63) },)
              }else if(el.option === DEFAULT_VALUES.svgOption.OPACITY){
                _page.drawRectangle({
                  x: (el.axisX*_page.getWidth())/pdfWidth,
                  y: (_page.getHeight() - (el.axisY*_page.getHeight())/pdfHeight) - 11,
                  width: (el.length*_page.getWidth())/pdfWidth,
                  height: 11,
                  color: rgb(1, 1, 0.),
                  opacity: 0.4,
                })
              }else{
                let _page:any =  pdfDoc.getPages()[el.page_number];
                const image = await pdfDoc.embedPng(el.svgImagePath);
                 await _page.drawImage(image, {
                    x: (((el.axisX)*_page.getWidth())/pdfWidth),
                    y:  (_page.getHeight() - (el.axisY*_page.getHeight())/pdfHeight) - (el.svgHeight*_page.getHeight())/pdfHeight, //added a proportional calculation to get the page height and divide by the movement along the y-axis 
                    width:  (el.svgWidth*_page.getWidth())/pdfWidth,
                    height: (el.svgHeight*_page.getHeight())/pdfHeight,
                    scale: 1
                  });
                  // console.log("msiiiiii",el.svgImagePath)
              } 
            }
            else if(el.type == "Image"){
              // console.log(el)
              let _page:any =  pdfDoc.getPages()[el.page_number];
              const image = await pdfDoc.embedPng(el.base64);
               await _page.drawImage(image, {
                  x: (((el.axisX)*_page.getWidth())/pdfWidth),
                  y: (_page.getHeight() - (el.axisY*_page.getHeight())/pdfHeight) - ((el.axisY2)*_page.getHeight())/pdfHeight, //added a proportional calculation to get the page height and divide by the movement along the y-axis 
                  width:  ((el.axisX2)*_page.getHeight())/pdfHeight,
                  height: ((el.axisY2)*_page.getHeight())/pdfHeight,
                  scale: 1* Number(el.elemScale)
                });
            }
            else if(el.type == "confirm"){
               if(el.option == 'sign'){
                let _page:any =  pdfDoc.getPages()[el.page_number];
                const image = await pdfDoc.embedPng(el.signaturePath)
                 await _page.drawImage(image, {
                    x: 25,
                    y: 10, //added a proportional calculation to get the page height and divide by the movement along the y-axis 
                    width:  40,
                    height: 20,
                    rotate: degrees(90),
                  });
               }
               else{
                  let _page:any = pdfDoc.getPages()[el.page_number];
                _page.drawText(el.text, {
                  x: 20,  
                  y: 55,
                  size:9,
                  rotate: degrees(90),
                });
               }
            }
            else if(el.type == "DrawText"){
              let _page = pdfDoc.getPages()[el.page_number];
              _page.drawText(el.text, {x: (el.axisX*_page.getWidth())/pdfWidth,   y: (_page.getHeight() - (el.axisY*_page.getHeight())/pdfHeight) - el.size + 2, size: el.size - 2 });
            }
            else if(el.type == "DrawLine"){
              let _page:any =  pdfDoc.getPages()[el.page_number];
                const image = await pdfDoc.embedPng(el.svgImagePath);
                 await _page.drawImage(image, {
                    x: (((el.axisX)*_page.getWidth())/pdfWidth),
                    y:  (_page.getHeight() - (el.axisY*_page.getHeight())/pdfHeight) - (el.svgHeight*_page.getHeight())/pdfHeight, //added a proportional calculation to get the page height and divide by the movement along the y-axis 
                    width:  (el.svgWidth*_page.getWidth())/pdfWidth,
                    height: (el.svgHeight*_page.getHeight())/pdfHeight,
                    scale: 1
                  })
              }
          })
 
          const pdfBytes = await pdfDoc.save();
          await writeFile("./src/services/pdf-generator/output.pdf", pdfBytes);
          // console.log(data)
          console.log('PDF created!');
         // @ts-ignore
          var datax = new FormData();
          //@ts-ignore
          datax.append('upload', fs.createReadStream('./src/services/pdf-generator/output.pdf'));
          datax.append('type', 'pdf');
          // console.log(datax);
          var configData = {
            method: 'post',
            url: `${app.get('base_url')}/files`,
            data : datax
          };

        await axios(configData)
          .then(function (response) {
            // console.log(response.data);
            context.data.fileName = response.data.originalname
            context.data.key = response.data.key
            context.data.downloadLink = response.data.location
            console.log(context.data.downloadLink);
          })
          .catch(function (error) {
            console.log(error);
            throw new Error(error)
          });

}

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [PdfGenerator],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
