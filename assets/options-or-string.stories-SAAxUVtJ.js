import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as r,c as u,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=u({linkId:"quantity-wc-check-box-repeating-options-or-string",text:"Enter a quantity",type:"quantity",repeats:!0,control:"check-box",answerConstraint:"optionsOrString",answerOption:c("quantity",[{value:70,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"},{value:80,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"}])}),t=JSON.stringify(o.form.questionnaire,null,2),q={title:"Question/quantity/with item-control/check-box/repeating/with answer-options",component:r,parameters:a,argTypes:i},e={name:"options or string",args:{questionnaireSource:t},render:n=>s.jsx(r,{scenario:{name:"quantity-wc-check-box-repeating-options-or-string",title:"options or string",build:()=>o},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "quantity-wc-check-box-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrString"];export{e as OptionsOrString,f as __namedExportsOrder,q as default};
