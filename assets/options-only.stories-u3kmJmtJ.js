import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as o,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=u({linkId:"quantity-wc-radio-button-repeating-options-only",text:"Enter a quantity",type:"quantity",repeats:!0,control:"radio-button",answerConstraint:"optionsOnly",answerOption:p("quantity",[{value:70,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"},{value:80,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"}])}),e=JSON.stringify(n.form.questionnaire,null,2),q={title:"Question/quantity/with item-control/radio-button/repeating/with answer-options",component:o,parameters:i,argTypes:s},t={name:"options only",args:{questionnaireSource:e},render:r=>a.jsx(o,{scenario:{name:"quantity-wc-radio-button-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:e})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "quantity-wc-radio-button-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...t.parameters?.docs?.source}}};const S=["OptionsOnly"];export{t as OptionsOnly,S as __namedExportsOrder,q as default};
