import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as n,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=u({linkId:"quantity-wc-spinner-repeating-options-or-string",text:"Enter a quantity",type:"quantity",repeats:!0,control:"spinner",answerConstraint:"optionsOrString",answerOption:p("quantity",[{value:70,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"},{value:80,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"}])}),t=JSON.stringify(r.form.questionnaire,null,2),q={title:"Question/quantity/with item-control/spinner/repeating/with answer-options",component:n,parameters:a,argTypes:i},e={name:"options or string",args:{questionnaireSource:t},render:o=>s.jsx(n,{scenario:{name:"quantity-wc-spinner-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:o.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "quantity-wc-spinner-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrString"];export{e as OptionsOrString,f as __namedExportsOrder,q as default};
