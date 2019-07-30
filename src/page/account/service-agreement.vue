<template>
    <div class="logo">
        <!--头部-->
        <!-- <common-header/> -->
        <div class="content_agree">
            <div class="header">
                <div class="back" @click="goBack" v-show="has_back">
                    <i class="iconfont icon-return"></i>
                </div>
                <div class="title">{{$t('accountInfo.agreements')}}</div>
            </div>
            <div class="context" v-if="!isShow">
                <p>本协议为《龙外卖用户服务协议》修订版本，自本协议发布之日起，龙外卖产品各处所称“龙外卖用户服务协议”均指本协议。</p>
                <p>【审慎阅读】您在申请注册流程中点击同意本协议之前，应当认真阅读本协议。请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款、法律适用和争议解决条款。免除或者限制责任的条款将以粗体下划线标识，您应重点阅读。</p>
                <h3>一、 概述</h3>
                <p>
                    第一条 &nbsp;本服务协议双方为湖州莘达科技有限公司旗下产品“龙外卖”（下称“龙外卖”）与龙外卖产品用户，本服务协议具有合同效力。
                </p>
                <p>
                    第二条 &nbsp;本服务协议内容包括协议正文及所有龙外卖已经发布的或将来可能发布的各类规则。所有规则为协议不可分割的一部分，与协议正文具有同等法律效力。
                </p>
                <p>
                    第三条 &nbsp;用户在使用龙外卖提供的各项服务的同时，承诺接受并遵守各项相关规则的规定。龙外卖有权根据需要不定时地制定、修改本协议或各类规则。如本协议有任何变更，龙外卖将在产品上刊载公告，通知予用户。如用户不同意相关变更，必须停止使用“服务”。经修订的协议一经在龙外卖产品公布后，立即自动生效。各类规则会在发布后生效，亦成为本协议的一部分。登录或继续使用“服务”将表示用户接受经修订的协议。除另行明确声明外，任何使
                    “服务”范围扩大或功能增强的新内容均受本协议约束。
                </p>
                <h3>二、 定义</h3>
                <p>
                    第四条 &nbsp;龙外卖的用户： 用户为具备完全民事行为能力的自然人。无民事行为能力人、限制民事行为能力人不当注册为龙外卖用户或超过其民事权利或行为能力范围从事交易的，其与龙外卖之间的服务协议自始无效，龙外卖一经发现，有权立即注销该用户，并追究其使用龙外卖“服务”的一切法律责任。
                </p>
                <p>
                    第五条 &nbsp;用户注册是指用户登录龙外卖产品，并按要求填写相关信息并确认同意履行相关用户协议的过程。用户因进行交易，获取订餐的有偿服务或接触龙外卖产品服务器而发生的所有应纳税赋，以及一切硬件、软件、服务及其他方面的费用均由用户负责支付。龙外卖产品仅作为订餐的交易平台。
                </p>
                <p>
                    第六条 &nbsp;龙外卖网上订餐系统： 由龙外卖自主开发，提供给用户进行产品上交易的平台软件，用户可以使用此系统进行订单和积分管理、商户可以使用此系统进行店铺和外卖信息的发布和订单管理。
                </p>
                <h3>三、 用户的权利和义务</h3>
                <p>
                    第七条 &nbsp;为了给广大用户营造一个健康、有序的网络服务交易平台，龙外卖对商户资质采取严格审核、紧密合作的方式，最大程度屏蔽用户虚假订单，减少餐馆的损失。龙外卖倡导诚信交易，并为此提供一系列的解决方案。
                </p>
                <p>
                    龙外卖为用户提供交易平台，龙外卖只能部分控制交易所涉及的产品的质量、安全或合法性、商贸信息的真实性或准确性，以及交易方履行其在贸易协议下的各项义务的能力。鉴于龙外卖平台具备存在海量信息及信息网络环境下信息与实物相分离的特点，龙外卖平台无法逐一审查商品及或服务的信息，无法逐一审查交易所涉及的商品及或服务的质量、安全以及合法性、真实性、准确性，对此您应谨慎判断。
                </p>
                <p>
                    第八条 &nbsp;普通用户的权利：
                </p>
                <p>
                    (一) &nbsp;用户有权利拥有自己在龙外卖产品的用户名及密码，并有权利使用自己的用户名及密码随时登录龙外卖网上订餐平台。用户不得以任何形式擅自转让或授权他人使用自己的龙外卖产品用户名；
                </p>
                <p>
                    (二) &nbsp;用户有权利使用龙外卖网上订餐系统和龙外卖商户在线取得直接联系，以获得最新的菜品信息和相关增值服务；用户点击“去结算”按钮后系统会自动生成包含商品名称、购买数量、应付总额、收货地址（如有）等信息的订单，用户应仔细核对。用户点击订单底部的“去支付”按钮，视为用户已阅读并同意外卖页面的所有内容并认可订单内容，订单内容及外卖页面信息视为用户与商户、配送服务商之间的外卖交易合同。
                </p>
                <p>
                    (三) &nbsp;商户确认用户订单后，将由商户或平台配送服务提供商完成配送服务。用户同意并知晓，部分商品由商户向您提供送货服务，在此情况下，送货服务相关标准按该商户在龙外卖网上订餐平台公示的标准执行（包括但不限于费用标准、送货时限等）；同时，部分商品由平台配送服务商向您提供配送服务，为您提供配送服务的一方将向您收取一定的配送服务费用，具体金额以您下单时系统显示的金额为准，您知悉并授权平台配送服务商代您向商户取货并将商品送到您所指定的收货地址。用户支付的配送费用将由龙外卖代为收取并支付给实际的配送服务提供商。用户有权以实际支付的金额为限要求就餐发票，餐费金额由商户提供，配送费金额由配送服务商提供。
                </p>
                <p>
                    (四) &nbsp;用户有权利对龙外卖商户的服务做出评价和投诉，并提出建议和意见；
                </p>
                <p>
                    (五) &nbsp;用户在龙外卖交易过程中如与商户因交易产生纠纷，可以请求龙外卖从中予以协调。对因商户或平台配送团队原因在整个物流配送过程中导致的货物损坏、损毁、灭失等情况，将由对应责任方承担赔偿责任，龙外卖将根据平台规则，积极配合用户对该部分损失进行追偿。用户如发现其他用户有违法或违反本服务协议的行为，可以向龙外卖进行反映要求处理。如用户因交易与其他用户产生诉讼的，用户有权通过司法部门要求龙外卖提供相关资料。
                </p>
                <p>
                    第九条 &nbsp;普通用户的义务：
                </p>
                <p>
                    (一) &nbsp;用户有义务在注册时提供自己的真实资料，并保证诸如电子邮件地址、联系电话、联系地址、邮政编码等内容的有效性及安全性，保证龙外卖及其他用户可以通过上述联系方式与自己进行联系。同时，用户也有义务在相关资料实际变更时及时更新有关注册资料。用户保证不以他人资料在龙外卖产品进行注册或认证。若用户使用虚假电话、姓名、地址或冒用他人信息使用龙外卖订餐服务，龙外卖将做出相应处罚或屏蔽地址的处理；
                </p>
                <p>
                    (二) &nbsp;用户不应在龙外卖网上订餐平台上恶意评价其他商户，或采取不正当手段提高自身的信用度或降低其他商户的信用度；
                </p>
                <p>
                    (三) &nbsp;龙外卖用户承诺自己在使用龙外卖产品时不会出现以下违规行为，如因出现以下违规行为导致任何法律后果的发生，龙外卖用户将以自己的名义独立承担所有法律责任：
                    <br />
                    <span class="violate">违反国家法律、法规要求以及各种社会公共利益或公共道德的行为；</span>
                    <br />
                    <span class="violate">违反国家法律、法规要求以及各种社会公共利益或公共道德的行为；违反龙外卖相关规定的行为（包括但不限于制造虚假订单、利用系统漏洞获取利润、违规套现等）；</span>
                    <br />
                    <span class="violate">其他损害龙外卖平台、商户和其他用户利益的行为。</span>
                </p>
                <p>
                    (四) &nbsp;龙外卖用户同意，不得对龙外卖产品上任何资料作商业性利用，包括但不限于在未经龙外卖事先书面批准的情况下，以复制、传播等方式使用在龙外卖产品上展示的任何资料；
                </p>
                <p>
                    (五) &nbsp;龙外卖用户同意接收来自龙外卖产品或者龙外卖产品合作伙伴发出的邮件、信息。
                </p>
                <p>
                    (六) &nbsp;龙外卖用户同意就因龙外卖平台产生的交易行为，授权龙外卖使用或允许第三人使用个人信息，包括但不限于身份信息、账户信息、交易信息等。
                </p>
                <p>
                    第十条 &nbsp;龙外卖的权利：
                </p>
                <p>
                    (一) &nbsp;对于用户在龙外卖网上订餐平台上的不当行为或其它任何龙外卖认为应当终止服务的情况，龙外卖有权随时做出删除相关信息、终止提供服务等处理，而无须征得用户的同意。
                </p>
                <p>
                    (二) &nbsp;用户在龙外卖网上订餐平台交易过程中如与其他用户因交易产生纠纷，请求龙外卖从中予以调处，经龙外卖审核后，龙外卖有权通过电话或电子邮件向纠纷双方了解情况，并将所了解的情况通过电话或电子邮件互相通知对方；
                </p>
                <p>
                    (三) &nbsp;龙外卖有权对用户的注册资料及交易行为进行查阅，发现注册资料或交易行为中存在任何问题或怀疑，均有权向用户发出询问及要求改正的通知或者直接做出删除等处理；
                </p>
                <p>
                    (四) &nbsp;经国家生效法律文书或行政处罚决定确认用户存在违法行为，或者龙外卖有足够事实依据可以认定用户存在违法或违反服务协议行为的，龙外卖有权在龙外卖交易平台及所在产品上以网络发布形式公布用户的违法行为；
                </p>
                <p>
                    (五) &nbsp;对于用户在龙外卖网上订餐平台发布的各类违规信息，龙外卖有权在不通知用户的前提下进行删除或采取其他限制性措施，包括但不限于：
                    <br />
                    <span class="violate">以规避费用为目的的信息；</span>
                    <br />
                    <span class="violate">以炒作信用为目的的信息；</span>
                    <br />
                    <span class="violate">存在欺诈等恶意或虚假内容的信息；</span>
                    <br />
                    <span class="violate">与网上订餐交易无关或不是以订餐为目的的信息；</span>
                    <br />
                    <span class="violate">存在恶意或其他试图扰乱正常订餐交易秩序因素的信息；</span>
                    <br />
                    <span class="violate">违反公共利益或可能严重损害龙外卖和其他用户合法利益的信息。</span>
                </p>
                <p>
                    (六) &nbsp;许可使用权。用户以此授予龙外卖独家的、全球通用的、永久的、免费的许可使用权利(并有权对该权利进行再授权)，使龙外卖有权(全部或部份地)使用、复制、修订、改写、发布、翻译、分发、执行和展示用户公示于产品的各类信息或制作其派生作品，和或以现在已知或日后开发的任何形式、媒体或技术，将上述信息纳入其他作品内；
                </p>
                <p>
                    (七) &nbsp;龙外卖会在用户的电脑上设定或取用龙外卖 Cookies。 龙外卖允许那些在龙外卖产品页上发布广告的公司到用户电脑上设定或取用 Cookies 。 在用户登录时获取资料，龙外卖使用 Cookies
                    可为用户提供个性化服务。 如果拒绝所有 Cookies，用户将不能使用需要登录的龙外卖产品及服务内容。
                </p>
                <p>
                    第十一条 &nbsp;龙外卖的义务：
                </p>
                <p>
                    (一) &nbsp;龙外卖有义务在现有技术上维护整个交易平台的正常运行，并努力提升和改进技术，使用户网上订餐交易活动得以顺利进行。
                </p>
                <p>
                    (二) &nbsp;对用户在注册使用龙外卖网上订餐平台中所遇到的与交易或注册有关的问题及反映的情况，龙外卖应及时做出回复。
                </p>
                <p>
                    (三) &nbsp;用户因在龙外卖网上订餐交易与其他用户产生诉讼的，用户通过司法部门或行政部门依照法定程序要求龙外卖提供相关资料，龙外卖应积极配合并提供有关资料。
                </p>
                <h3>四、 服务的中断和终止</h3>
                <p>
                    第十二条 &nbsp;用户同意，在龙外卖未向用户收取服务费的情况下，龙外卖可自行全权决定以任何理由 (包括但不限于龙外卖认为用户已违反本协议的字面意义和精神，或以不符合本协议的字面意义和精神的方式行事，或用户在超过90天的时间内未以用户的账号及密码登录产品等)
                    终止用户的“服务”密码、账户 (或其任何部份) 或用户对“服务”的使用，并删除（不再保存）用户在使用“服务”中提交的任何资料。同时龙外卖可自行全权决定，在发出通知或不发出通知的情况下，随时停止提供“服务”或其任何部份。账号终止后，龙外卖没有义务为用户保留原账号中或与之相关的任何信息，或转发任何未曾阅读或发送的信息给用户或第三方。此外，龙外卖用户同意，龙外卖不就终止用户接入“服务”而对用户或任何第三者承担任何责任。
                </p>
                <p>
                    第十三条 &nbsp;如用户向龙外卖提出注销龙外卖产品注册用户身份时，经龙外卖审核同意，由龙外卖注销该注册用户，用户即解除与龙外卖的服务协议关系。但注销该用户账号后，龙外卖仍保留下列权利：
                </p>
                <p>
                    (一) &nbsp;用户注销后，龙外卖有权保留该用户的注册资料及以前的交易行为记录；
                </p>
                <p>
                    (二) &nbsp;用户注销后，如用户在注销前在龙外卖网上订餐平台上存在违法行为或违反合同的行为，龙外卖仍可行使本服务协议所规定的权利。
                </p>
                <p>
                    第十四条 &nbsp;在下列情况下，龙外卖可以通过注销用户的方式终止服务：
                </p>
                <p>
                    (一) &nbsp;在用户违反本服务协议相关规定时，龙外卖有权直接终止向该用户提供服务。但如该用户在被龙外卖终止提供服务后，再一次直接或间接或以他人名义注册为龙外卖用户的，龙外卖有权再次单方面终止向该用户提供服务；
                </p>
                <p>
                    (二) &nbsp;如龙外卖通过用户提供的信息与用户联系时，发现用户在注册时填写的电子邮箱已不存在或无法接收电子邮件的，经龙外卖以其他联系方式通知用户更改，而用户在三个工作日内仍未能提供新的电子邮箱地址的，龙外卖有权终止向该用户提供服务；
                </p>
                <p>
                    (三) &nbsp;一旦龙外卖发现用户注册资料中主要内容是虚假的，龙外卖有权随时终止向该用户提供服务；
                </p>
                <p>
                    (四) &nbsp;本服务协议终止或更新时，用户明示不愿接受新的服务协议的；
                </p>
                <p>
                    (五) &nbsp;其它龙外卖认为需终止服务的情况。
                </p>
                <p>
                    第十五条 &nbsp;因用户违反法律法规或者违反服务协议规定而致使龙外卖中断、终止对用户服务的，对于服务中断、终止之前用户交易行为依下列原则处理：
                </p>
                <p>
                    (一) &nbsp;服务中断、终止之前，用户已经上传至龙外卖产品的产品尚未交易或尚未交易完成的，龙外卖有权在中断、终止服务的同时删除此项物品的相关信息；
                </p>
                <p>
                    (二) &nbsp;服务中断、终止之前，用户已经就其他用户出售的具体产品做出要约，但交易尚未结束，龙外卖有权在中断或终止服务的同时删除该用户的相关要约；
                </p>
                <p>
                    (三) &nbsp;服务中断、终止之前，用户已经与另一用户就具体交易达成一致，龙外卖可以不删除该项交易，但龙外卖有权在中断、终止服务的同时将用户被中断或终止服务的情况通知用户的交易对方。
                </p>
                <p>
                    第十六条 &nbsp;对于用户在龙外卖网上订餐平台出现包括但不限于刷单虚假订单等损害龙外卖利益的行为，龙外卖有权单方终止提供服务，并要求用户双倍返还因刷单虚假订单等行为取得的不当利益，如不足以赔偿龙外卖的实际损失，龙外卖有权进一步追偿并保留提起诉的权利。
                </p>
                <h3>五、 责任范围</h3>
                <p>
                    第十七条 &nbsp;用户明确理解和同意，龙外卖不对因下述任一情况而导致的任何损害赔偿承担责任，包括但不限于利润、商誉、使用、数据等方面的损失或其他无形损失的损害赔偿 (无论龙外卖是否已被告知该等损害赔偿的可能性)：
                </p>
                <p>
                    (一) &nbsp;使用或未能使用“服务”；
                </p>
                <p>
                    (二) &nbsp;第三方未经批准的接入或第三方更改用户的传输资料或数据；
                </p>
                <p>
                    (三) &nbsp;第三方对“服务”的声明或关于“服务”的行为；
                </p>
                <p>
                    (四) &nbsp;或非因龙外卖的原因而引起的与“服务”有关的任何其他事宜，包括疏忽。
                </p>
                <p>
                    第十八条 &nbsp;用户明确理解并同意，如因其违反有关法律或者本协议之规定，使龙外卖遭受任何损失，受到任何第三方的索赔，或任何行政管理部门的处罚，用户应对龙外卖提供补偿，包括合理的律师费用。
                </p>
                <h3>六、 食品安全保障</h3>
                <p>
                    第十九条 &nbsp;用户通过龙外卖订购的食品若发生食品安全问题或品质不合格，对自身健康，权益造成损害，引起食物中毒或其他不良后果，用户有权利发起投诉并向商户追责，经查明属实，龙外卖可就用户因此产生的损失及相应的经济赔偿向商户进行追偿。
                </p>
                <p>
                    第二十条 &nbsp;用户发布信息进行投诉时，龙外卖会对用户提供的信息进行复核，并有权要求用户提供相应证据来证明信息的真实性及合法性，在用户无法提供有效证明时，龙外卖有权删除相关信息或终止赔偿，用户可自行与商户沟通进行追责。
                </p>
                <h3>七、 隐私权政策</h3>
                <p>
                    第二十一条 &nbsp;适用范围：
                </p>
                <p>
                    (一) &nbsp;在用户注册龙外卖账户时，用户根据龙外卖要求提供的个人注册信息；
                </p>
                <p>
                    (二) &nbsp;在用户使用龙外卖服务，参加龙外卖活动，或访问龙外卖产品页时，龙外卖自动接收并记录的用户浏览器上的服务器数值，包括但不限于IP地址等资料及用户要求取用的产品页记录；
                </p>
                <p>
                    (三) &nbsp;龙外卖收集到的用户在龙外卖进行网上订餐交易的有关资料，包括但不限于出价、购买、产品登录、信用评价及违规记录；
                </p>
                <p>
                    (四) &nbsp;龙外卖通过合法途径从商业伙伴处取得的用户个人资料。
                </p>
                <p>
                    第二十二条 &nbsp;信息使用：
                </p>
                <p>
                    (五) &nbsp;第三除本协议另有约定的外，龙外卖不会向任何人出售或出借用户的个人信息，除非事先得到用户的许可。
                </p>
                <p>
                    (六) &nbsp;龙外卖亦不允许任何第三方以任何手段收集、编辑、出售或者无偿传播用户的个人信息。任何用户如从事上述活动，一经发现，龙外卖有权立即终止与该用户的服务协议，查封其账号；
                </p>
                <p>
                    (七) &nbsp;为服务用户的目的，龙外卖可能通过使用用户的个人信息，向用户提供服务，包括但不限于向用户发出产品和服务信息，或者与龙外卖合作伙伴共享信息以便他们向用户发送有关其产品和服务的信息。
                </p>
                <p>
                    第二十三条 &nbsp;信息披露
                    <br /> 用户的个人信息将在下述情况下部分或全部被披露：
                </p>
                <p>
                    (一) &nbsp;经用户同意，向第三方披露；
                </p>
                <p>
                    (二) &nbsp;如用户是合资格的知识产权投诉人并已提起投诉，应被投诉人要求，向被投诉人披露，以便双方处理可能的权利纠纷；
                </p>
                <p>
                    (三) &nbsp;根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构披露；
                </p>
                <p>
                    (四) &nbsp;如果用户出现违反中国有关法律或者产品政策的情况，需要向第三方披露；
                </p>
                <p>
                    (五) &nbsp;为提供你所要求的产品和服务，而必须和第三方分享用户的个人信息；
                </p>
                <p>
                    (六) &nbsp;其他龙外卖根据法律或者产品政策认为合适的披露；
                </p>
                <p>
                    (七) &nbsp;在龙外卖产品上创建的某一网上订餐交易中，如交易任何一方履行或部分履行了网上订餐交易义务并提出信息披露请求的，龙外卖有全权可以决定向该用户提供其交易对方的联络方式等必要信息，以促成网上订餐交易的完成或纠纷的解决。
                </p>
                <p>
                    第二十四条 &nbsp;信息安全
                </p>
                <p>
                    (一) &nbsp;龙外卖账户均有密码保护功能，请妥善保管用户的账户及密码信息；
                </p>
                <p>
                    (二) &nbsp;在使用龙外卖服务进行交易时，用户不可避免的要向网上订餐交易对方或潜在的网上订餐交易对方提供自己的个人信息，如联络方式或者邮政地址。请用户妥善保护自己的个人信息，仅在必要的情形下向他人提供；
                </p>
                <p>
                    (三) &nbsp;如果用户发现自己的个人信息泄密，尤其是龙外卖账户或及密码发生泄露，请用户立即联络龙外卖客服，以便龙外卖采取相应措施。
                </p>
                <p>
                    第二十五条 &nbsp;Cookie的使用
                </p>
                <p>
                    (一) &nbsp;通过龙外卖所设Cookie所取得的有关信息，将适用本政策；
                </p>
                <p>
                    (二) &nbsp;在龙外卖上发布广告的公司通过广告在用户电脑上设定的Cookies，将按其自己的隐私权政策使用。
                </p>
                <p>
                    第二十六条 &nbsp;编辑和删除个人信息的权限： 用户可以点击我的龙外卖对用户的个人信息进行编辑和删除，除非龙外卖另有规定。
                </p>
                <h3>七、 附则</h3>
                <p>
                    第二十七条 &nbsp;本协议不涉及用户与龙外卖其它用户之间因产品上交易而产生的法律关系及法律纠纷。
                </p>
                <p>
                    第二十八条 &nbsp;龙外卖保留对本协议做出不定时修改的权利。以公示的协议内容为准。
                </p>
                <p>
                    当您按照注册页面提示填写信息、阅读并同意本协议且完成全部注册程序后，即表示您已充分阅读、理解并接受本协议的全部内容，并与龙外卖达成一致，成为龙外卖平台“用户”。阅读本协议的过程中，如果您不同意本协议或其中任何条款约定，您应立即停止注册程序。
                </p>
                <!-- <div class="footer">
            <div>版本号：v1.01</div>
            <div>&copy; 2018.Loong-delivery Technologies Inc.</div>
        </div> -->
            </div>
            <div class="context" v-else>
                <p style="margin-top: 2.3rem;">Agreement) amendment version, from the date of publication of this agreement, Loong Delivery Service Products
                    are known as “Loong Delivery User Service Agreement” refers to this agreement</p>
                <p>(Read Carefully)By registering an account with us, should read this agreement carefully.Please be sure to
                    read carefully,fully understand the contents of the articles,in particular the terms of exemption or
                    limitation of liability,law application and dispute resolution clause.The terms of exemption or limitation
                    of liability will be marked in bold underlineYou should focus on reading this agreement.</p>
                <!-- <h3>一、 概述</h3> -->
                <p>
                    1. &nbsp;The two sides of the service agreement for Huzhou Xinda Technology Co., Ltd. Products “Loong Delivery”(known as
                    “Loong Delivery”)and Loong delivery service products user,this service agreement has the contract effect
                </p>
                <p>
                    2. &nbsp;The content of this service agreement includes the agreement text and all Loong delivery various rules that have
                    been published or may be published in the future.All rules are an integral part of the agreement, this
                    agreement texthave the same as the legal effect.
                </p>
                <p>
                    3. &nbsp;Users are using the services provided by Loong delivery, havecommitment to accept and comply with the rules of the
                    relevant regulations. Loong delivery have the right to keep formulate, modify this agreement or any of
                    the rules based on needs. Any change of this agreement, Loong delivery
                </p>
                <!-- <h3>二、 定义</h3> -->
                <p>
                    4. &nbsp;Article Loong users: Users with full civil capacity of the natural person. Persons without capacity for civil conduct,
                    if a person who restricts the capacity for civil conduct is improperly registered as a Loong or exceeds
                    the scope of his civil rights or capacity to conduct a transaction, the service agreement between it
                    and the Loong is invalid from the beginning, and if the Loong is found, it has the right to cancel the
                    user immediately and hold it to use Loong takeout. Based on "all legal liability.
                </p>
                <p>
                    5. &nbsp;User registers refer to the user to sign in the Loong to sell the product, and according to the request fills in
                    the relevant information and confirms agrees to fulfill the related user agreement the process. All taxable
                    items incurred by the user for the transaction, obtaining paid service for ordering meals or contacting
                    the Loong product server, and all hardware, software, services and other expenses are paid by the user.
                    Loong take-away products only serve as a trading platform for meals.
                </p>
                <p>
                    6 &nbsp;Loong takeout Online ordering system: By the Loong outside the independent development, provide users with the products
                    on the trading platform software, users can use this system for order and points management, merchants
                    can use this system for shop and take-away information publishing and order management.
                </p>
                <!-- <h3>三、 用户的权利和义务</h3> -->
                <p>
                    7. &nbsp;In order to create a healthy and proper network services trading platform for the vast number of users, Loong to
                    the merchant's qualification to take strict audit, close cooperation method, do the greatest degree to
                    protect the users for false information also to reduce the loss of restaurants. Loong takeout advocates
                    good faith trading and provides a range of solutions for this purpose. Loong Takeout provides a trading
                    platform for users, Loong takeout can only partially control the quality, safety or legality of the products
                    involved in the trading, the authenticity or accuracy of business information, and the ability of the
                    trader to fulfill its obligations under the trade agreement. Since the Loong delivery platform has the
                    characteristics of the separation of information and objects in the presence of massive information and
                    information network environment, you should be cautious in judging the quality, safety, legality, authenticity
                    and accuracy of the goods and/or services involved in the exchange, which cannot be examined by the Loong
                    delivery platform.
                </p>
                <p>
                    8. &nbsp;Rights and ordinary:
                </p>
                <p>
                    (a) The user has the right to have their own Loong takeout products, user name and password, and have the right to use their
                    own username and password at any time to login Loong takeout online booking platform. The user may not
                    in any form transfer or authorize others to use own Loong to sell the product user name;
                </p>
                <p>
                    (b) The user has the right to use the Loong takeout online ordering system and the Loong takeout merchant online to obtain
                    direct contact, to obtain the latest food information and related value-added services; When the user
                    clicks on the "Go to Checkout" button, the system will automatically generate orders containing information
                    such as the name of the product, the quantity purchased, the total amount payable, and the address of
                    the receipt (if any). , the user should check carefully. User clicks on the bottom of the "Go to Pay"
                    button, as the user has read and agreed to give all the content of the page and to recognize the order
                    content, order content and takeaway page information as the user and the merchant, distribution service
                    provider between the delivery of the contract.
                </p>
                <p>
                    (c) After the merchant confirms the user's order, the Merchant or platform delivery service provider will complete the delivery
                    service. Users agree and know that some of the goods by the Merchant to provide you with delivery services,
                    in this case, the delivery service standards according to the merchant in the Loong takeout online booking
                    platform for the implementation of standards (including but not limited to cost standards, delivery time
                    limit, etc.); At the same time, some products by the platform delivery service providers to provide you
                    with distribution services, To provide you with the delivery of services to the side will be charged
                    to you a certain delivery services, the specific amount of the amount you order when the system will
                    be displayed, you know and authorize the platform delivery service providers on behalf of you to pick
                    up goods and goods to your designated delivery address. The delivery fee paid by the user will be collected
                    by Loong and paid to the actual delivery service provider. The user has the right to pay the actual amount
                    of the meal invoices, meals are provided by the merchant, the amount of delivery by the delivery service
                    provider.
                </p>
                <p>
                    (d) Users have the right to evaluate and complain about the service of the Loong takeout, and make suggestions and opinions;
                </p>
                <p>
                    (e) Users in the Loong takeout of the sale of foreign trade in the process, such as merchant disputes arising from the transaction,
                    you can request Loong to coordinate the delivery. For merchant or platform distribution team cause in
                    the entire logistics delivery process caused by goods damage, other damage, loss and so on, will be responsible
                    for the responsibility of compensation, Loong will be in accordance with the Platform rules, actively
                    cooperate with the user to recover this part of the loss. If the user discovers that the other user has
                    illegal or violates this service agreement of behavior, May to the Loong takeout carry on the reflection
                    request processing. If the user causes the lawsuit for the transaction with other user, the user has
                    the right through the Judicial Department request Loong to provide the related information.
                </p>
                <p>
                    9. &nbsp;Obligations of ordinary users:
                </p>
                <p>
                    (a) The user is obligated to provide their own real information at the time of registration, and to ensure the validity and
                    safety of such contents as email address, telephone number, contact address, postal code, etc., to ensure
                    that Loong and other users can contact themselves through the above contact method. At the same time,
                    users have the obligation to update the relevant information in the actual changes in the relevant registration
                    information. The user guarantees not to be registered or certified by other people's information in the
                    Loong takeout product. If the user uses the false telephone, the name, the address or uses other people's
                    information to use the Loong takeout to order the meal service, the Loong takeout will make the corresponding
                    punishment or the shielding address processing;
                </p>
                <p>
                    (b) Users should not be in the Loong takeout online ordering platform malicious evaluation of other merchants, or to take
                    improper means to improve their own credit or reduce the credibility of other merchants;
                </p>
                <p>
                    (c) Loong users promise to use Loong takeout products will not be the following irregularities, such as the occurrence of
                    any of the following irregularities caused by any legal consequences, Loong users will be in their own
                    name independently bear all the legal responsibility: violation of national laws, Regulatory requirements
                    and the conduct of various social public interests or public morals;
                </p>
                <p>
                    (d) The Loong user agrees not to make commercial use of any information on Loong products, including, but not limited to,
                    the use of any information displayed on the Loong takeout product in the form of reproduction, dissemination,
                    etc. without the prior written approval of the Loong takeout;
                </p>
                <p>
                    (e) Loong customers agree to receive mail and information from Loong or Loong products partners.
                </p>
                <p>
                    (f) Loong users agree to authorize Loong to use or allow a third party to use personal information, including but not limited
                    to identity information, account information, transaction information, and so on, as a result of Loong
                    transactions.
                </p>
                <p>
                    10. &nbsp;Loong takeout rights
                </p>
                <p>
                    (a) In case of misconduct by a user on a Loong online ordering platform or any other Loong that the service is deemed to
                    be terminated, the Loong is entitled to delete the relevant information at any time, terminate the provision
                    of services, etc. without obtaining the consent of the user.
                </p>
                <p>
                    (b) Users in the Loong takeout online ordering platform trading process, such as with other users due to transactions arising
                    from disputes, request Loong takeout from the mediation, after the Loong, after the audit, Loong takeout
                    right by telephone or e-mail to the parties to the dispute to understand the situation, and notify each
                    other by telephone or email of what is known;
                </p>
                <p>
                    (c) Loong has the right to inspect the registration data and transaction behavior of the user, and finds that there are any
                    problems or suspicions in the registration information or transaction behavior, and has the right to
                    issue inquiries and requests for correction to the user or to make the removal process directly;
                </p>
                <p>
                    (d) The legal instrument of entry into force of the State or the administrative penalty decided to confirm the violation
                    of the user, or Loong the fact that there is sufficient factual basis can be found that the user has
                    illegal or breach of service agreement, Loong have the right on the Loong platform and the product on
                    the network published in the form of ；
                </p>
                <p>
                    (e) for users in the Loong takeout online booking platform for the release of various types of violations of information,
                    Loong outside the right to do not notify users under the premise of the deletion or other restrictive
                    measures, including but not limited to: to evade the cost of the purpose of information, to hype credit
                    for the purpose of information; Information about malicious or false content such as fraud, information
                    that is unrelated to the online ordering transaction or is not intended for the purpose of ordering meals;
                    there are malicious or other information that attempts to disrupt the order of the normal ordering of
                    orders, breaches of the public interest or may seriously impair the legitimate interests of Loong and
                    other users
                </p>
                <p>
                    (f) permission to use. In this way, the user is granted exclusive, universal, permanent and free license to use (and the
                    right to authorize the Loong), so that the Loong is entitled (wholly or partially) to use, reproduce,
                    revise, rewrite, publish, translate, distribute, To carry out and display all kinds of information that
                    the user has publicized in the product or to produce its derivative works, and to incorporate such information
                    into other works in any form, media or technology which is now known or later developed;
                </p>
                <p>
                    11. &nbsp; Loong takeout obligation:
                </p>
                <p>
                    (a) Loong has the obligation to maintain the normal operation of the entire trading platform in the existing technology,
                    and to improve and improve the technology, so that users online meal trading activities smoothly.
                </p>
                <p>
                    (b) For users in the registration of the use of Loong online booking platform to deal with transactions or registration-related
                    issues and reflect the situation, Loong should be timely response to the takeaway.
                </p>
                <p>
                    (c) The user, because of the Loong takeout online ordering transaction and other users of litigation, the user through the
                    Judicial department or administrative departments in accordance with the legal procedures required to
                    provide relevant information Loong, Loong takeout should actively cooperate with and provide relevant
                    information.
                </p>
                <p>
                    12. &nbsp;the user agrees, in the case of Loong not charging a service charge to the user, the Loong is free to decide for
                    any reason (including but not limited to Loong) that the user has violated the literal meaning and spirit
                    of this Agreement or acted in a manner inconsistent with the literal meaning and spirit of this Agreement,
                    Or the user does not terminate the user's "service" password for more than 90 days without the user's
                    account number and password. Account (or any part thereof) or the user's use of the service, and delete
                    (no longer save) any information submitted by the user in the use of the service. At the same time, Loong
                    may, at its sole discretion, discontinue the provision of "service" or any part thereof at any time by
                    notice or without notice. After the account is terminated, Loong is not obligated to keep the original
                    account or any information related to it, or forward any information that has not been read or sent to
                    the user or a third party. In addition, the Loong takeout user agrees, the Loong outside sale does not
                    terminate the user to connect "the service" to the user or any third party undertakes any responsibility.
                </p>
                <p>
                    13. &nbsp;If the user to Loong out of the Loong outside the sale of products registered user identity, after the Loong audit
                    agreed, by the Loong out of the registered users, the user is to release the service agreement with the
                    Loong of the relationship. However, after the cancellation of the user account, Loong still retains the
                    following rights:
                </p>
                <p>
                    (a) After the user has written off, the Loong has the right to retain the user's registration information and previous transactions
                    record;
                </p>
                <p>
                    (b) After the user has written off, such as the user before the cancellation in the Loong takeout online ordering platform
                    on the existence of illegal or breach of contract behavior, Loong can still exercise the rights stipulated
                    in this service agreement.
                </p>
                <p>
                    14. &nbsp;In the following cases, Loong can terminate the service by logging off the user:
                </p>
                <p>
                    (a) When the user violates the relevant provisions of this service agreement, Loong has the right to terminate the service
                    directly to the user. However, if the user after the Loong is terminated to provide services, and once
                    again directly or indirectly or in the name of others registered as Loong takeout users, Loong takeout
                    right to unilaterally terminate the provision of services to the user;
                </p>
                <p>
                    (b) If Loong is contacted with the user through information provided by the user, discover that the user fills in the email
                    address which does not exist or cannot receive the e-mail in the registration, after Loong the customer
                    to notify the user to change by other contact, and the user in three business days still fails to provide
                    the new electronic mail addresses, Loong the right to terminate the service provided to the user;
                </p>
                <p>
                    (c) Once the Loong is found to be false in the user registration data, Loong is entitled to terminate the service to the
                    user at any time;
                </p>
                <p>
                    (d) When the service agreement is terminated or updated, the user is expressly unwilling to accept the new service agreement;
                </p>
                <p>
                    (e) Other cases where the Loong is deemed to have to terminate the service.
                </p>
                <p>
                    15. &nbsp;Due to the user violates the laws and regulations or violates the service agreement stipulation to cause the Loong
                    to sell off, terminates to the user Service, to the service interruption, the termination before the
                    user transaction behavior according to the following principle processing:
                </p>
                <p>
                    (a) before the interruption of service and termination, the user has uploaded to the Loong products which have not yet been
                    traded or have not been completed, the Loong is entitled to delete the relevant information of the item
                    at the same time as the interruption and termination of the service;
                </p>
                <p>
                    (b) Before the interruption of service, the user has made an offer in respect of a specific product sold by another user,
                    but the transaction has not been concluded, and the Loong has the right to delete the relevant offer
                    of the user at the time of interruption or termination of the service;
                </p>
                <p>
                    (c) before the interruption of service, the user has reached agreement with another user on the specific transaction, Loong
                    the sale may not delete the transaction, but the Loong is entitled to notify the user of the transaction
                    when the interruption or termination of the service is interrupted or terminated.
                </p>
                <p>
                    16. &nbsp;For users in the Loong takeout online ordering platform, including but not limited to brush a false order, such
                    as damage to the Loong of the benefit of the sale of the Act, Loong the right to unilaterally terminate
                    the provision of services, and require users to double the return of a false order and other acts to
                    obtain improper benefits, If it is not sufficient to compensate for the actual loss of Loong, Loong is
                    entitled to further recover and retain the right to prosecute.
                </p>
                <p>
                    17. &nbsp;The user clearly understands and agrees, Loong is not liable for any damages arising out of any of the following
                    circumstances, including, but not limited to, loss of profit, goodwill, use, data, or other intangible
                    loss (whether Loong has been informed of the possibility of such damages or not):
                </p>
                <p>
                    (a) Use or failure to use the service;
                </p>
                <p>
                    (b) unauthorized access by third parties or alteration of the transmission data or data of the user by a third party;
                </p>
                <p>
                    (c) A third party's declaration of "Service" or the Act relating to "service";
                </p>
                <p>
                    (d) Any other matter, including negligence, arising out of or in connection with "services", which is not attributable to
                    the Loong of the sale.
                </p>
                <p>
                    18. &nbsp;The user clearly understands and agrees that, in case of breach of the relevant laws or the provisions of this
                    Agreement, the Loong is liable to any loss, any third party's claim, or any administrative department's
                    punishment, the user shall provide compensation for Loong, including reasonable attorneys ' fees.
                </p>
                <p>
                    19. &nbsp;The user orders through Loong takeout food if food safety problems or quality unqualified, to their own health,
                    rights and interests caused by damage, causing food poisoning or other adverse consequences, the user
                    has the right to initiate complaints and to the merchant responsible, after the identification is true,
                    The Loong can recover the loss and the corresponding financial compensation from the customers.
                </p>
                <p>
                    20. &nbsp;When the user publishes the information to complain, Loong will review the information provided by the user, and
                    have the right to require the user to provide evidence to prove the authenticity and legality of the
                    information, when the user can not provide effective proof, Loong sell the right to delete the relevant
                    information or termination of compensation, users can communicate with the merchant to carry out the
                    responsibility. Privacy Policy
                </p>
                <p>
                    21. &nbsp; Scope of application:
                </p>
                <p>
                    (a) When the user registers the Loong takeout account, the user according to Loong the request to provide the personal registration
                    information;
                </p>
                <p>
                    (b) The server values on the user's browser that are automatically received and recorded by Loong when the user uses Loong
                    takeout service, participate in Loong take-away activities, or visit the Loong product page, including
                    but not limited to information such as IP address and the product page records that the user requests
                    to take;
                </p>
                <p>
                    (c) Loong the information collected by the users on the online ordering transaction on the Loong takeout, including but not
                    limited to bid, purchase, product login, credit evaluation and irregularity record;
                </p>
                <p>
                    (d) User profiles obtained by Loong from business partners through legal means. The 24th article information uses:
                </p>
                <!-- <p>
                        22. &nbsp;
                    </p>
                    <p>
                        23. &nbsp;
                    </p> -->
                <p>
                    24. &nbsp;Usage of Information:
                </p>
                <p>
                    (e) Except as otherwise agreed in this agreement, Loong does not sell or lend personal information to any person except with
                    the prior permission of the user.
                </p>
                <p>
                    (f) Loong takeout also does not allow any third party to collect, edit, sell or distribute the user's personal information
                    by any means. Any user who engages in the above activities, upon discovery, Loong the right to terminate
                    the service agreement with the user immediately and seize his account;
                </p>
                <p>
                    (g) For the purposes of service users, Loong may provide services to users through the use of their personal information,
                    including, but not limited to, sending product and service information to the user or sharing information
                    with Loong's takeaway partners so that they can send users information about their products and services.
                </p>
                <p>
                    25. &nbsp;Information Disclosure
                </p>
                <p>
                    The user's personal information will be disclosed in part or all of the following situations:
                </p>
                <p>
                    (a) disclosed to a third party with the consent of the user;
                </p>
                <p>
                    (b) If the user is a qualified intellectual property complainant and has filed a complaint, it should be requested by the
                    complainant to disclose it to the complainant so that the parties may deal with the possible rights dispute;
                </p>
                <p>
                    (c) disclosed to a third party or to an administrative or judicial institution in accordance with the relevant provisions
                    of the law or the requirements of an administrative or judicial body;
                </p>
                <p>
                    (d) If a user appears to violate China's laws or product policies, it needs to be disclosed to a third party;
                </p>
                <p>
                    (e) to share the user's personal information with third parties in order to provide the products and services you require;
                </p>
                <p>
                    (f) Disclosure of other Loong in accordance with the law or product policy, as deemed appropriate;
                </p>
                <p>
                    (g) an online ordering transaction created on a Loong take-away product, such as the performance of any party to the transaction
                    or the partial fulfillment of the online order
                </p>
                <p>
                    26. &nbsp;Information Security
                </p>
                <p>
                    (a) Loong external sales account has a password protection function, please keep the user's account and password information
                    properly;
                </p>
                <p>
                    (b) in the use of Loong take-away services for transactions, users will inevitably be to the Internet to order a meal transaction
                    each other or potential online ordering transaction to provide their personal information, such as contact
                    details or postal address. Ask the user to properly protect their personal information, only if necessary
                    to provide to others;
                </p>
                <p>
                    (c) If users find their personal information leaks, especially Loong external selling account or and password leakage, please
                    contact the customer immediately Loong takeout customer service, in order to Loong takeout to take appropriate
                    measures.
                </p>
                <p>
                    27. &nbsp;Cookies Usage
                </p>
                <p>
                    (a) This policy will apply to the information obtained through Loong cookies;
                </p>
                <p>
                    (b) companies that advertise on Loong takeout will use their own privacy policy by advertising cookies set on the user's
                    computer.
                </p>
                <p>
                    28. &nbsp;Permission to edit and delete personal information: Users can click on my Loong to edit and delete the user's personal
                    information, unless Loong is otherwise stipulated.
                </p>
                <p>
                    29. &nbsp;This agreement does not involve the legal relationship and legal dispute arising from the transaction between the
                    user and Loong other users.
                </p>
                <p>
                    30. &nbsp;Loong Takeout reserves the right to make irregular changes to this agreement. The content of the agreement shall
                    prevail. When you follow the registration page prompts to fill in the information, read and agree to
                    this agreement and complete the registration process, that means that you have fully read, understand
                    and accept the full content of this agreement, and Loong with the delivery of an agreement to become
                    a Loong delivery platform "user." During reading this agreement, if you do not agree to this Agreement
                    or any of its terms and conditions, you should immediately stop the registration process.
                </p>
            </div>
        </div>
        <!--返回顶部-->
        <common-back-top/>
        <!--底部-->
        <common-footer/>
    </div>
</template>
<script>
    import { getCookie } from "../../utils.js"
    export default {
        name: "service-agreement",
        data() {
            return {
                isShow: false,
                has_back: true,
            }
        },
        mounted() {
            console.log(1, history.length);
            if (history.length == 1) {
                this.has_back = false;
            } else {
                this.has_back = true;
            }
            let lang = getCookie('lang')
            if (lang == 'en') {
                this.isShow = true
            } else {
                this.isShow = false
            }
            window.scroll(0, 0)
        },
        methods: {
            goBack() {
                this.$router.go(-1)
            }
        }
    };
</script>
<style scoped lang="scss">
    .logo {
        // position: relative;
        .header {
            // z-index: 1;
            height: 40px;
            line-height: 40px; // padding: 10px;
            width: 100%;
            text-align: center;
            background: #FFF8ED;
            position: relative;
            .back {
                display: inline-block;
                position: absolute;
                top: 0;
                left: 10px;
                i {
                    font-size: 24px;
                    &:hover {
                        background: #c5c5c5;
                    }
                }
            }
            .title {
                font-size: 20px;
                margin-left: 10px;
                display: inline-block;
            }
        }
        .content_agree {
            background: #fff;
            margin-top: 20px;
            padding: 1rem;
            margin: 20px 100px; // text-align: center;
            font-size: 14px;
            .context {
                margin-top: 18px;
            }
            h3 {
                color: #D69D00;
            }
        }
        .footer {
            text-align: center;
            position: absolute;
            bottom: 1rem;
            left: 3.3rem;
            font-size: 14px;
            color: #717070;
        }
    }
</style>