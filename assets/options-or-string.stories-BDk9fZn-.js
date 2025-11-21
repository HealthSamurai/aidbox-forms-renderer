import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as t,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=u({linkId:"quantity-wc-spinner-non-repeating-options-or-string",text:"Enter a quantity",type:"quantity",repeats:!1,control:"spinner",answerConstraint:"optionsOrString",answerOption:p("quantity",[{value:70,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"},{value:80,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"}])}),n=JSON.stringify(r.form.questionnaire,null,2),f={title:"Question/quantity/with item-control/spinner/non-repeating/with answer-options",component:t,parameters:a,argTypes:i},e={name:"options or string",args:{questionnaireSource:n},render:o=>s.jsx(t,{scenario:{name:"quantity-wc-spinner-non-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:o.questionnaireSource,defaultSource:n})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "quantity-wc-spinner-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const q=["OptionsOrString"];export{e as OptionsOrString,q as __namedExportsOrder,f as default};
