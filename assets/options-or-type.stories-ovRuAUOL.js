import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as o,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"quantity-wc-text-box-non-repeating-options-or-type",text:"Enter a quantity",type:"quantity",repeats:!1,control:"text-box",answerConstraint:"optionsOrType",answerOption:u("quantity",[{value:70,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"},{value:80,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"}])}),t=JSON.stringify(n.form.questionnaire,null,2),x={title:"Question/quantity/with item-control/text-box/non-repeating/with answer-options",component:o,parameters:i,argTypes:s},e={name:"options or type",args:{questionnaireSource:t},render:r=>a.jsx(o,{scenario:{name:"quantity-wc-text-box-non-repeating-options-or-type",title:"options or type",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "quantity-wc-text-box-non-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,x as default};
