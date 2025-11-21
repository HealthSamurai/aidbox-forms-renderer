import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as n,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=u({linkId:"quantity-woc-non-repeating-options-or-string",text:"Enter a quantity",type:"quantity",repeats:!1,answerConstraint:"optionsOrString",answerOption:p("quantity",[{value:70,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"},{value:80,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"}])}),t=JSON.stringify(o.form.questionnaire,null,2),f={title:"Question/quantity/without item-control/non-repeating/with answer-options",component:n,parameters:a,argTypes:i},e={name:"options or string",args:{questionnaireSource:t},render:r=>s.jsx(n,{scenario:{name:"quantity-woc-non-repeating-options-or-string",title:"options or string",build:()=>o},questionnaireSource:r.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "quantity-woc-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const q=["OptionsOrString"];export{e as OptionsOrString,q as __namedExportsOrder,f as default};
