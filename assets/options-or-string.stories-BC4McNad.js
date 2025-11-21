import{j as i}from"./index-BsWNCus6.js";import{b as s,a,N as n,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=u({linkId:"quantity-wc-radio-button-non-repeating-options-or-string",text:"Enter a quantity",type:"quantity",repeats:!1,control:"radio-button",answerConstraint:"optionsOrString",answerOption:p("quantity",[{value:70,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"},{value:80,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"}])}),e=JSON.stringify(o.form.questionnaire,null,2),f={title:"Question/quantity/with item-control/radio-button/non-repeating/with answer-options",component:n,parameters:a,argTypes:s},t={name:"options or string",args:{questionnaireSource:e},render:r=>i.jsx(n,{scenario:{name:"quantity-wc-radio-button-non-repeating-options-or-string",title:"options or string",build:()=>o},questionnaireSource:r.questionnaireSource,defaultSource:e})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "quantity-wc-radio-button-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...t.parameters?.docs?.source}}};const q=["OptionsOrString"];export{t as OptionsOrString,q as __namedExportsOrder,f as default};
