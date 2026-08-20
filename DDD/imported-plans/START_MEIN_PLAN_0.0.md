سأعتمد في النص أدناه الدومين المذكور صراحةً في السياق الذي أرسلته: **`koli-one.com` لـ Koli Parts**، مع بقاء **`koli.one` لـ Koli One** وربط الحسابين عبر SSO آمن، وليس عبر مشاركة cookies بين الدومينين.

كما عدّلت البرومت ليفرض على النموذج فحص الواقع الحالي قبل اقتراح أي إعادة بناء؛ فالمشروع ليس فارغًا: الـroot مهيأ كـ Turbo monorepo، و`package-lock.json` يثبت وجود `apps/api` بـ NestJS 11 و`apps/web` بـ Next.js 16.2.12 وReact 19.2.4. كما أن SPEC الحالي يحدد Bulgaria + eBay DE + VIN/TecDoc/DTC + semi-automation ومؤشرات قبول واضحة.

وهناك Gate إلزامي أضفته إلى البرومت: على النموذج أن يتحقق من `developer.ebay.com` قبل تصميم الشراء الآلي؛ فالوصول إلى Buy APIs/Order API في Production يخضع لشروط وموافقات، وeBay نفسها تنصح بالحصول على الموافقة قبل الاستثمار الكبير في checkout integration.

# MASTER PROMPT — KOLI PARTS

## Production Architecture, Business Model, eBay Integration, Koli One SSO, Compliance & Execution Plan

أنت الآن تعمل بصفة فريق قيادة تقني وتجاري كامل لمشروع **Koli Parts**، وليس كمساعد يعطي اقتراحات عامة.

تعمل في هذه المهمة كالتالي:

- CTO
- Chief Product Officer
- Principal Software Architect
- Staff Full-Stack Engineer
- Marketplace Architect
- Automotive Parts Data Architect
- eBay Integration Architect
- Payments Architect
- Security Engineer
- DevOps / SRE
- Database Architect
- Search Architect
- AI/RAG Architect
- Automotive Fitment Expert
- TecDoc Integration Expert
- VIN Data Expert
- Bulgarian Automotive Market Expert
- EU E-commerce Compliance Analyst
- Marketplace Trust & Safety Expert
- Conversion / Growth Product Expert

مهمتك ليست البدء العشوائي بالبرمجة.

مهمتك الأولى هي:

> **إجراء تدقيق كامل للمشروع الموجود فعليًا، والتحقق من جميع الافتراضات التجارية والتقنية، ثم بناء الخطة الرئيسية النهائية من الألف إلى الياء لـ Koli Parts، بحيث تصبح الوثيقة المرجعية الرسمية التي سيُنفذ المشروع بالكامل على أساسها.**

---

# 0. قواعد غير قابلة للتفاوض

## 0.1 مجلد المشروع

المجلد الجذري الرسمي الوحيد هو:

```text
C:\Users\hamda\Desktop\Koli_Parts_Root
```

ابدأ من هذا المجلد.

لا تنشئ مشروعًا جديدًا في مكان آخر.

لا تفترض أن المشروع فارغ.

لا تعمل من الذاكرة فقط.

افحص الملفات والمجلدات الموجودة فعليًا أولًا.

---

# 0.2 الملفات الموجودة حاليًا

من الملفات التي نعرف أنها موجودة بالفعل:

```text
C:\Users\hamda\Desktop\Koli_Parts_Root\
│
├── package.json
├── package-lock.json
├── turbo.json
├── .env.example
├── .gitignore
└── START_MEIN_PLAN_1.0.md
```

وتوجد بالفعل مؤشرات في dependency tree على:

```text
apps/
├── api/
└── web/
```

مع بنية تقنية موجودة بالفعل تتضمن تقريبًا:

- Turbo monorepo
- Node.js >=20
- NestJS backend
- Next.js frontend
- React
- TypeScript

لا تعِد إنشاء هذه البنية قبل فحصها.

---

# 0.3 ترتيب التنفيذ الإجباري

نفّذ المهمة بهذا الترتيب:

```text
DISCOVER
→ AUDIT
→ VERIFY
→ IDENTIFY CONTRADICTIONS
→ RESEARCH
→ DECIDE
→ ARCHITECT
→ PLAN
→ DEFINE ACCEPTANCE CRITERIA
→ ONLY THEN IMPLEMENT
```

في هذه المهمة الأساسية، الأولوية هي **الخطة الشاملة الصحيحة**.

لا تبدأ كتابة عشرات الملفات البرمجية قبل إثبات أن النموذج التجاري والهندسة المقترحة قابلان للتنفيذ.

---

# 0.4 لا تهلوس

ممنوع أن تقول إن:

- API يسمح بشيء لم تتحقق منه.
- eBay يسمح بالأتمتة الكاملة إذا لم تثبت ذلك وثائقه الحالية.
- Sandbox يساوي Production من ناحية الصلاحيات.
- وجود endpoint في documentation يعني أن Production access متاح لحسابنا.
- Fulfillment API يمكن استخدامه لشراء المنتجات فقط بسبب اسمه.
- eBay DE يستطيع تنفيذ dropshipping إلى بلغاريا بالطريقة المطلوبة دون تحقق.
- TecDoc يمنحنا نوع بيانات معين دون التحقق من الترخيص والعقد.
- VAT أو OSS أو consumer law يعمل بطريقة معينة دون مصدر رسمي حديث.

عندما لا يوجد دليل:

اكتب:

```text
UNVERIFIED
```

أو:

```text
BLOCKED PENDING EXTERNAL APPROVAL
```

بدل اختراع حل.

---

# 1. تعريف المشروع

اسم المشروع:

```text
Koli Parts
```

Koli Parts منصة تجارة إلكترونية ذكية ومتخصصة في **قطع غيار السيارات** تبدأ من بلغاريا ثم تتوسع تدريجيًا داخل الاتحاد الأوروبي.

النموذج الأساسي المستهدف حاليًا:

```text
German/eBay inventory
→ Koli Parts discovery & fitment
→ Bulgarian customer
→ Koli Parts checkout/order orchestration
→ supplier purchase/fulfillment
→ delivery
```

ولكن لا تعتبر أن هذا النموذج قابل للتنفيذ آليًا بالكامل حتى يتم إثبات ذلك رسميًا.

---

# 2. الدومينات والعلاقة مع Koli One

اعتبر البنية الحالية المطلوبة:

## Koli One

```text
https://koli.one
```

هو مشروع السيارات الرئيسي.

## Koli Parts

الدومين الجديد للمشروع:

```text
https://koli-one.com
```

ويجب أن تدرس كذلك، ضمن DNS/infrastructure plan، الحاجة إلى subdomains مثل:

```text
www.koli-one.com
api.koli-one.com
admin.koli-one.com
auth.koli-one.com
status.koli-one.com
```

لكن لا تعتمد أي subdomain غير ضروري قبل تقديم justification.

---

# 3. الربط بين Koli One وKoli Parts

هذه قاعدة Product Constitution:

> مستخدم Koli One يجب ألا يضطر إلى إنشاء حساب جديد من الصفر في Koli Parts.

نريد تجربة:

```text
Koli One user
       ↓
Open Koli Parts
       ↓
SSO / trusted identity exchange
       ↓
User recognized
       ↓
Koli Parts profile provisioned automatically
```

لا تستخدم password duplication.

لا تنقل password hashes بين النظامين.

لا تبنِ نظامي هوية مستقلين إذا لم توجد ضرورة حقيقية.

ولأن:

```text
koli.one
```

و:

```text
koli-one.com
```

دومينان مستقلان، لا تفترض إمكانية مشاركة authentication cookie بينهما.

---

# 3.1 افحص Koli One قبل اتخاذ قرار SSO

إذا كان مستودع Koli One متاحًا، اعتبره source of truth لهوية Koli One.

افحص فعليًا:

- Firebase Authentication architecture
- user IDs
- custom claims
- sessions
- backend token verification
- roles
- dealer accounts
- personal seller accounts
- permissions
- logout/revocation
- email verification
- account deletion
- GDPR deletion workflow

ثم صمم طريقة ربط Koli Parts به.

ادرس بالترتيب:

### Option A

استخدام نفس Firebase Authentication tenant/project إذا كان ذلك آمنًا ومناسبًا.

### Option B

Firebase ID token verification داخل Koli Parts backend.

### Option C

Central Identity Broker / OAuth2/OIDC-style token exchange.

### Option D

Custom-token based account handoff.

اختر واحدًا فقط بعد المقارنة.

---

# 3.2 المطلوب في SSO architecture

حدد بالتفصيل:

```text
identity owner
subject/user ID
token issuer
audience
access token
refresh/session model
CSRF protection
PKCE if applicable
state
nonce
redirect allow-list
token replay prevention
revocation
logout propagation
account deletion propagation
user provisioning
role mapping
audit log
```

ويجب وجود mapping واضح مثل:

```text
KoliOneUser
        ↓
externalIdentity
        ↓
KoliPartsUser
```

بحيث لا نكرر بيانات المستخدم بلا داعٍ.

---

# 4. الرؤية الأساسية لـ Koli Parts

لا نريد متجر قطع تقليديًا فقط.

المنتج يجب أن يحل أكبر مشكلة في شراء قطع السيارات:

> **هل هذه القطعة مناسبة فعلًا لسيارتي؟**

لذلك قلب المنتج هو:

```text
Vehicle Identity
+
VIN
+
OEM Numbers
+
TecDoc
+
eBay/External Listing Data
+
Compatibility Rules
+
Seller Reliability
+
Historical Outcomes
=
Fitment Confidence Engine
```

---

# 5. الوظائف الأساسية

يجب أن تغطي الخطة جميع ما يلي.

## 5.1 Vehicle Garage

يمكن للمستخدم حفظ عدة سيارات.

لكل سيارة:

```text
VIN
make
model
generation
variant
production year
engine
engine code
fuel
power
transmission
body
drivetrain
OEM identifiers where applicable
```

---

# 5.2 VIN Search

المستخدم يستطيع:

- إدخال VIN.
- حفظ السيارة.
- البحث عن قطع متوافقة.
- استخدام السيارة تلقائيًا لتصفية النتائج.

حدد:

- VIN provider strategy.
- provider abstraction.
- caching.
- cost control.
- confidence.
- fallbacks.
- unsupported VIN handling.
- EU VIN considerations.

---

# 5.3 TecDoc

ادرس دمج TecDoc كمصدر أساسي لبيانات fitment.

حدد:

- licensing.
- API/data delivery options.
- article IDs.
- vehicles.
- linkages.
- OEM references.
- manufacturers.
- categories.
- assembly groups.
- cross references.
- update frequency.
- caching.
- normalization.
- reconciliation with eBay attributes.

لا تدّعِ وجود access غير موجود.

---

# 5.4 OEM Number Search

يجب أن يستطيع المستخدم البحث بـ:

```text
OEM number
part number
manufacturer part number
EAN/GTIN where available
free text
vehicle attributes
VIN
DTC
```

---

# 5.5 DTC → Parts Intelligence

أضف إلى الخطة محركًا مستقبليًا يربط:

```text
DTC code
→ affected systems
→ likely components
→ diagnostic warnings
→ compatible parts
```

مثال:

```text
P0101
→ MAF system
→ diagnostic explanation
→ possible causes
→ MAF-related products
```

لكن:

لا تجعل DTC يساوي تشخيصًا مؤكدًا.

يجب عرض درجة الثقة والتنبيه المناسب.

---

# 5.6 New + Used Parts

المشروع يجب أن يستطيع مستقبلاً دعم:

```text
NEW
USED
REMANUFACTURED
REFURBISHED
OPEN BOX
OTHER
```

مع normalization واضح للحالات القادمة من الموردين.

---

# 5.7 Fitment Confidence Score

أنشئ specification مفصلة لمؤشر:

```text
0–100 Compatibility Confidence
```

مصادره قد تشمل:

- VIN match.
- exact OEM match.
- TecDoc fitment.
- engine code.
- vehicle generation.
- production range.
- eBay compatibility metadata.
- seller data.
- listing quality.
- historic return reasons.
- previous confirmed fits.

يجب منع الادعاء بأن:

```text
97% = mathematically 97% probability
```

ما لم يكن لدينا calibration حقيقي.

ميز بين:

```text
rule score
confidence tier
statistically calibrated probability
```

---

# 6. تجربة البحث

نريد بحثًا أسرع وأسهل من متاجر قطع السيارات التقليدية.

يجب دراسة:

```text
free-text search
VIN-aware search
OEM search
autocomplete
typo tolerance
facets
synonyms
Bulgarian terminology
English terminology
German listing terminology
transliteration
part aliases
vehicle aliases
semantic retrieval
keyword retrieval
```

مثال:

```text
дебитомер astra j 1.7
MAF Astra J
Luftmassenmesser Astra J
OEM 55562426
```

يجب أن يستطيع النظام ربطها بالسياق نفسه عند توفر البيانات.

---

# 7. استراتيجية Search Engine

لا تختر محرك بحث من باب العادة.

قارن:

```text
PostgreSQL FTS
Meilisearch
Typesense
OpenSearch
Algolia
pgvector
hybrid architectures
```

قارن حسب:

- search quality.
- Bulgarian support.
- German terms.
- typo tolerance.
- facets.
- latency.
- indexing complexity.
- operational cost.
- scaling.
- vector support.
- developer productivity.

ثم اختر architecture واحدة للـMVP.

---

# 8. التكامل مع eBay

المصدر الرسمي الأول والوحيد للحقيقة التقنية حول eBay هو:

```text
https://developer.ebay.com/
```

استخدم وثائق eBay الحالية وقت تنفيذ المهمة.

لا تعتمد على blog posts قديمة أو StackOverflow في تحديد قدرات APIs.

يمكن استخدامها فقط كمصدر ثانوي للمشكلات، وليس كمصدر سلطة.

---

# 8.1 eBay Feasibility Gate — إلزامي قبل أي تنفيذ

قبل كتابة eBay integration architecture، أجب بالدليل الرسمي عن الأسئلة التالية:

1. ما APIs المتاحة فعليًا في 2026؟
2. أي منها GA؟
3. أي منها Beta؟
4. أي منها Limited Release؟
5. ما الذي يمكن استخدامه في Sandbox؟
6. ما الذي يحتاج Production approval؟
7. ما الذي يحتاج eBay Partner Network؟
8. ما الذي يحتاج Business Unit approval؟
9. ما الذي يحتاج Application Growth Check؟
10. هل Order API متاح لحالة Koli Parts؟
11. هل يمكن استخدامه للـmember checkout؟
12. هل يمكن استخدامه للـguest checkout؟
13. هل checkout يدعم الحالة:

```text
EBAY_DE seller
→ Bulgarian delivery address
```

14. هل توجد marketplace/country restrictions؟
15. هل توجد restrictions على off-eBay buying experiences؟
16. هل توجد restrictions على dropshipping business model؟
17. هل يمكن Koli Parts أن يكون Merchant of Record؟
18. هل يمكن لنا تحديد عنوان العميل النهائي عند تنفيذ المورد؟
19. ماذا يحدث مع VAT؟
20. ماذا يحدث مع returns؟
21. كيف يتم التعامل مع seller invoices داخل الطرد؟
22. هل automatic purchasing مسموح؟
23. هل automated buyer accounts مسموحة؟
24. هل استخدام browser automation مطلوب أو ممنوع أو غير مدعوم؟
25. هل توجد APIs رسمية لاستلام حالة طلب اشتريناه؟
26. ما notifications المتاحة؟
27. ما Rate Limits؟
28. ما data-retention requirements؟
29. ما attribution requirements؟
30. ما branding/UX requirements؟

أنشئ:

```text
EBAY_FEASIBILITY_MATRIX.md
```

بأعمدة:

```text
Capability
Required API
Sandbox
Production
Approval
Marketplace
Known Restriction
Evidence
Status
Koli Parts Impact
```

---

# 8.2 لا تخلط Buy وSell APIs

صنّف كل API بوضوح إلى:

```text
BUY
SELL
COMMERCE
DEVELOPER
```

واشرح لماذا يحتاجه Koli Parts.

خصوصًا:

```text
Browse API
Feed API
Order API
Offer API
Marketing API
Identity API
Taxonomy API
Catalog API
Translation API
Notification API
Sell Fulfillment API
Sell Inventory API
```

لا تستخدم API فقط لأن الاسم يبدو مناسبًا.

---

# 8.3 Browse API

حدد بالتفصيل كيف سنستخدم Browse API في:

```text
keyword search
category search
item retrieval
legacy item IDs
filters
price
condition
seller information
shipping information
compatibility
images
item URL
availability
marketplace
```

ويجب تحديد استخدام:

```text
X-EBAY-C-MARKETPLACE-ID: EBAY_DE
```

حيثما تتطلب الوثائق ذلك.

حدد أيضًا:

- Application access token.
- client credentials flow.
- token caching.
- token expiry handling.
- rate-limit handling.
- request timeout.
- circuit breaker.
- retries.
- caching.
- data normalization.

---

# 8.4 Feed API

تحقق هل Buy Feed API مناسب لنا لتقليل عدد live searches.

إن كان مناسبًا، صمم:

```text
eBay Feed
     ↓
ingestion
     ↓
normalization
     ↓
deduplication
     ↓
listing DB
     ↓
search index
     ↓
periodic refresh
```

وحدد:

- feed availability.
- marketplace support.
- category strategy.
- file size.
- refresh cadence.
- delta handling.
- stale inventory policy.
- licensing/storage rules.

---

# 8.5 eBay OAuth

أنشئ documentation واضحة للفرق بين:

## Application token

```text
client_credentials
```

و:

## User token

```text
authorization_code
```

حدد:

```text
Client ID
Client Secret
RuName
redirect/accept URL
reject URL
authorization code
access token
refresh token
scope
state
token expiry
token rotation
revocation
```

يجب فصل:

```text
SANDBOX
```

عن:

```text
PRODUCTION
```

بالكامل.

---

# 8.6 eBay credentials

اقترح `.env.example` بدون أي secrets حقيقية:

```text
EBAY_ENV=sandbox

EBAY_CLIENT_ID=
EBAY_CLIENT_SECRET=
EBAY_RUNAME=
EBAY_REDIRECT_URI=

EBAY_MARKETPLACE_ID=EBAY_DE

EBAY_API_BASE_URL=
EBAY_OAUTH_BASE_URL=

EBAY_APP_ACCESS_TOKEN_CACHE_TTL=
EBAY_WEBHOOK_VERIFICATION_TOKEN=

EBAY_EPN_CAMPAIGN_ID=
```

ولا تخزن production credentials في Git.

---

# 8.7 eBay Sandbox

اكتب خطة اختبار حقيقية تشمل:

```text
developer account
sandbox keyset
sandbox users
test buyer
test seller where required
OAuth
Browse
mock inventory
checkout feasibility
notifications
error cases
rate limits
expired tokens
cancelled orders
refunds
shipping
```

ولا تعتبر نجاح Sandbox إثباتًا لـProduction approval.

---

# 8.8 Production Approval Track

اجعل eBay approval workstream مستقلًا عن البرمجة:

```text
E0 Developer Account
E1 Sandbox Keys
E2 Production Keys
E3 EPN assessment
E4 Restricted API assessment
E5 Growth Check
E6 Business model review
E7 Required agreements
E8 Checkout approval
E9 Production certification
E10 Go/No-Go
```

حدد Owner وdependency وblocking impact لكل واحدة.

---

# 9. أهم قرار تجاري: هل الشراء الآلي من eBay ممكن أصلًا؟

لا تبنِ المشروع كله على افتراض غير مثبت.

أنشئ Decision Tree:

```text
Can official eBay APIs execute our intended checkout legally and technically?
```

## YES

صمم official API purchasing workflow.

## NO

لا تستخدم browser automation للتحايل على القيود.

بدلًا من ذلك، قارن حلولًا قانونية مثل:

```text
approved eBay partner path
affiliate/referral model
manual/semi-manual purchasing
German procurement account
German fulfillment/forwarding hub
direct agreements with high-quality German sellers
B2B wholesalers
TecDoc-connected distributors
hybrid supplier architecture
```

هدفنا الحفاظ على Koli Parts كمنتج حتى إن كانت إحدى قنوات التوريد غير متاحة.

---

# 10. Supplier Abstraction Layer

لا تجعل database أو business logic مرتبطين بـeBay فقط.

صمم:

```text
SupplierAdapter
```

مثل:

```text
EbaySupplierAdapter
TecDocDistributorAdapter
B2BWholesalerAdapter
FutureMarketplaceAdapter
```

بعقود مثل:

```ts
searchProducts();
getProduct();
getAvailability();
getPrice();
getShippingQuote();
validateOrder();
placeOrder();
getOrderStatus();
getTracking();
cancelOrder();
requestReturn();
```

لكن capability يجب أن تكون explicit.

مثال:

```ts
capabilities: {
  automatedOrdering: false,
  liveInventory: true,
  trackingApi: false
}
```

حتى لا يفترض النظام وجود capability غير مدعومة.

---

# 11. نموذج الربح

يوجد في الإعدادات الحالية مفهوم هامش بسيط.

لا تثبت الهامش النهائي بدون business model.

ابنِ Pricing Engine يدعم:

```text
supplier price
supplier shipping
payment fee
FX if applicable
VAT
platform margin
risk buffer
return reserve
optional delivery fee
discount
final selling price
```

ادرس نموذج:

```text
percentage margin
fixed margin
category-specific margin
minimum contribution margin
dynamic margin
```

ولكن حافظ في MVP على البساطة.

---

# 12. Pricing Snapshot

أحد أخطر أخطاء dropshipping هو تغير سعر المورد بعد دفع العميل.

يجب تصميم:

```text
Quote
```

مع:

```text
supplierPriceAtQuote
shippingAtQuote
taxAtQuote
marginAtQuote
finalPrice
quoteExpiresAt
listingSnapshot
```

ولا تعتمد على live listing دون snapshot.

---

# 13. Inventory Risk

خطط للحالات:

```text
item sold out
quantity changed
price changed
seller stopped shipping
listing removed
condition changed
delivery changed
seller blocked
API unavailable
```

قبل أخذ المال وبعده.

أنشئ explicit pre-purchase validation.

---

# 14. Seller Reliability Engine

أنشئ score للبائعين يعتمد على بيانات متاحة قانونيًا مثل:

```text
feedback
feedback count
seller status
delivery
returns history internal to Koli Parts
cancellations
listing quality
inventory mismatch
problem rate
```

ثم:

```text
allow-list
watch-list
deny-list
```

---

# 15. مخاطر الطرد والفاتورة

حلل بالتفصيل:

```text
supplier invoice inside parcel
supplier branding
German returns address
customer discovers supplier price
multiple sellers = multiple parcels
shipping delays
wrong item
damaged item
used-part condition dispute
warranty responsibility
```

ولا تخفِ هذه المخاطر.

حدد mitigation واقعي لكل واحدة.

---

# 16. Checkout Architecture

قبل checkout:

```text
Cart
→ Validate Vehicle Fitment
→ Refresh Supplier Data
→ Validate Availability
→ Recalculate Price
→ Validate Shipping
→ Validate Seller
→ Lock Quote
→ Payment
```

ثم:

```text
Payment Authorized
→ Internal Order
→ Procurement Queue
→ Admin Approval
→ Supplier Purchase
→ Procurement Confirmation
→ Payment Capture / final state
→ Tracking
```

ادرس بعناية استخدام:

```text
authorize first
capture later
```

مقابل:

```text
immediate capture
```

لتقليل refund risk عندما يفشل شراء المورد.

---

# 17. الوضع شبه الآلي أولًا

هذه قاعدة إلزامية.

MVP لا يبدأ بـfull automatic procurement.

استخدم:

```text
Customer pays/authorizes
        ↓
Order → PENDING_PROCUREMENT_REVIEW
        ↓
System revalidates
        ↓
Admin sees:
- supplier
- listing
- fitment
- price
- margin
- shipping
- seller risk
- customer address
        ↓
APPROVE / REJECT
        ↓
supplier procurement
```

يجب تسجيل admin actor والوقت والسبب.

---

# 18. Procurement State Machine

صمم state machine صريحة مثل:

```text
DRAFT

PRICE_VALIDATION
FITMENT_VALIDATION
PAYMENT_PENDING
PAYMENT_AUTHORIZED

PROCUREMENT_PENDING
PROCUREMENT_REVIEW
PROCUREMENT_APPROVED
PROCUREMENT_STARTED
PROCUREMENT_CONFIRMED

SUPPLIER_REJECTED
SUPPLIER_OUT_OF_STOCK
SUPPLIER_PRICE_CHANGED

FULFILLMENT_PENDING
SHIPPED
DELIVERED

CANCELLATION_PENDING
CANCELLED

RETURN_REQUESTED
RETURN_APPROVED
RETURN_IN_TRANSIT
RETURN_RECEIVED

REFUND_PENDING
REFUNDED

MANUAL_REVIEW
FAILED
```

لا تستخدم status string عشوائي بلا state transition rules.

---

# 19. Idempotency

يجب استخدام idempotency في:

- order creation.
- payment.
- procurement.
- webhooks.
- refund.
- fulfillment updates.

حدد:

```text
idempotency key
payload hash
result
status
createdAt
expiresAt
```

---

# 20. Payments

قارن:

```text
Stripe
PayPal
```

للـMVP.

حدد:

- PaymentIntent.
- authorization/capture.
- 3DS/SCA.
- webhook verification.
- refund.
- dispute.
- chargeback.
- idempotency.
- reconciliation.
- VAT data.
- invoice linkage.

Koli Parts لا يخزن card details.

---

# 21. بلغاريا

السوق الأول:

```text
Bulgaria
```

اللغة الافتراضية:

```text
Bulgarian
```

واللغة الثانية:

```text
English
```

العملة الأساسية للمشروع يجب التحقق منها وفق الوضع الرسمي الحالي في بلغاريا وقت التنفيذ، ثم توحيدها في جميع الخدمات.

لا تعتمد على بيانات قانونية قديمة.

---

# 22. Bulgarian UX

صمم المنتج للمستخدم البلغاري وليس كنسخة مترجمة من موقع ألماني.

ادرس:

```text
Bulgarian automotive terminology
vehicle search habits
OEM search behavior
mobile-first behavior
trust signals
delivery expectations
returns expectations
price sensitivity
used-parts behavior
garage/workshop use
```

---

# 23. Econt

يوجد Econt في configuration الحالي.

حدد إن كان دوره:

```text
domestic last mile
return logistics
warehouse forwarding
internal supplier route
```

أو إن كان غير مطلوب في direct eBay shipping model.

لا تدمجه لمجرد أن credentials/config موجودة.

---

# 24. Database

اعتمد PostgreSQL ما لم توجد حجة قوية لتغييره.

أنشئ ERD كاملًا.

ادرس جداول مثل:

```text
users
external_identities

vehicles
vin_lookups

brands
vehicle_models
vehicle_variants
engines

products
product_oem_numbers
product_identifiers

supplier_products
supplier_listings
supplier_listing_snapshots

sellers
seller_scores

fitments
fitment_evidence
compatibility_evaluations

search_queries

carts
cart_items
quotes

orders
order_items
order_events

payments
payment_events

procurements
procurement_attempts

shipments
tracking_events

returns
refunds

webhook_events

sync_jobs
sync_runs
sync_errors

admin_users
audit_logs

feature_flags
```

---

# 25. Data Separation

ميّز بين:

```text
canonical product
```

و:

```text
supplier listing
```

القطعة الواحدة قد يكون لها:

```text
1 Canonical Product
→ N Supplier Listings
```

هذه قاعدة هندسية أساسية.

---

# 26. Event Architecture

حدد الأحداث المهمة مثل:

```text
UserProvisioned
VehicleAdded
VinDecoded
ListingImported
ListingChanged
FitmentCalculated
QuoteCreated
PaymentAuthorized
OrderCreated
ProcurementRequested
ProcurementApproved
ProcurementFailed
SupplierOrderConfirmed
ShipmentCreated
TrackingUpdated
OrderDelivered
ReturnRequested
RefundCompleted
```

حدد متى نحتاج queue ومتى لا.

لا تحول MVP إلى distributed microservices بلا حاجة.

---

# 27. Architecture Philosophy

ابدأ من:

```text
modular monolith
```

إذا كان ذلك أفضل للمشروع.

لا تستخدم microservices أو Kubernetes لمجرد أنها تبدو enterprise.

قارن فعليًا:

```text
Modular Monolith
vs
Microservices
```

وفق:

- team size.
- complexity.
- deployment.
- cost.
- debugging.
- reliability.
- future scale.

---

# 28. Backend

يوجد NestJS حاليًا حسب المشروع الموجود.

لا تغيّره إلى Fastify-only architecture أو framework آخر دون سبب مثبت.

حدد Modules مثل:

```text
AuthModule
UsersModule
VehiclesModule
VinModule
CatalogModule
SuppliersModule
EbayModule
FitmentModule
SearchModule
CartModule
PricingModule
OrdersModule
PaymentsModule
ProcurementModule
ShippingModule
ReturnsModule
NotificationsModule
AdminModule
AuditModule
```

---

# 29. Frontend

افحص Next.js الموجود أولًا.

صمم information architecture:

```text
/
 /search
 /parts/[slug]
 /garage
 /garage/[vehicleId]
 /cart
 /checkout
 /orders
 /orders/[id]
 /account

 /vin
 /oem

 /admin
 /admin/orders
 /admin/procurement
 /admin/listings
 /admin/sellers
 /admin/fitment
 /admin/sync
 /admin/audit
```

حدد Server Components / Client Components حسب الحاجة، لا حسب العادة.

---

# 30. صفحات المنتج

يجب أن تعرض:

```text
title
brand
manufacturer
OEM references
condition
images
price
shipping
delivery estimate
seller/source
fitment evidence
compatibility confidence
why it fits
why confidence is limited
returns
warranty where applicable
```

---

# 31. Trust UX

من أهم العناصر:

```text
Fits your Opel Astra J 1.7 CDTI
```

لكن يجب عدم عرضها إلا بثقة كافية.

بدل ذلك:

```text
Confirmed fit
High-confidence fit
Likely fit — verify OEM
Compatibility unknown
Not compatible
```

حدد thresholds وقواعد UX.

---

# 32. Admin Control Center

الـAdmin ليس CRUD dashboard فقط.

يجب أن يكون مركز تشغيل Koli Parts.

يشمل:

```text
Procurement Queue
Failed Orders
Price Changes
Out-of-stock Alerts
Seller Risk
Fitment Review
Refund Queue
Returns
Sync Health
eBay API Health
Payment Reconciliation
Audit Trail
Manual Overrides
Feature Flags
Automation Controls
```

---

# 33. Automation Levels

صمم Levels واضحة:

## Level 0

```text
manual procurement
```

## Level 1

```text
system prepares procurement
admin executes
```

## Level 2

```text
system executes after admin approval
```

## Level 3

```text
auto execution only for trusted cases
```

## Level 4

```text
full automation where compliant
```

لا تنتقل بين المراحل بناءً على الزمن فقط.

---

# 34. Automation Eligibility Engine

مثال:

```text
autoPurchaseAllowed =
  officialApiPermitsIt
  AND sellerTrusted
  AND exactFitment
  AND priceDelta <= threshold
  AND margin >= minimum
  AND inventoryConfirmed
  AND shippingConfirmed
  AND orderValue <= riskLimit
  AND fraudScore <= threshold
```

---

# 35. Legal & Compliance Workstream

استخدم المصادر الرسمية الحالية فقط قدر الإمكان:

- European Commission.
- Bulgarian government authorities.
- NRA/NAP.
- Bulgarian consumer protection authority.
- GDPR official guidance.
- eBay official agreements/policies.

تحقق من:

```text
Merchant of Record
VAT
OSS
consumer withdrawal rights
14-day right where applicable
returns
warranty
used parts
electronic parts
B2C invoicing
GDPR
cookies
DSA where applicable
DAC7 where applicable
cross-border sales
product safety
GPSR
WEEE where applicable
battery regulations where applicable
hazardous automotive goods
oil/fluids
airbags
pyrotechnic components
used safety components
trademark/image usage
eBay data licensing
```

لا تعتبر القائمة كلها applicable تلقائيًا.

اكتب:

```text
Applicable
Possibly Applicable
Not Applicable
Needs Legal Confirmation
```

---

# 36. Security

أنشئ threat model.

غَطِّ:

```text
credential theft
eBay token theft
payment webhook spoofing
IDOR
broken authorization
admin takeover
SSRF
XSS
CSRF
SQL injection
mass assignment
rate abuse
VIN enumeration
coupon abuse
payment fraud
refund fraud
supplier manipulation
webhook replay
price manipulation
inventory race conditions
PII leakage
secret leakage
dependency attacks
```

---

# 37. Secrets

Production secrets:

لا توضع في:

```text
.env committed to Git
database plaintext
logs
frontend bundle
```

استخدم managed secrets حسب cloud المختار.

صمم encryption-at-rest للتوكنات الحساسة.

---

# 38. RBAC

حدد roles مثل:

```text
customer

support
procurement_operator
fitment_reviewer
finance
admin
super_admin
```

طبق least privilege.

---

# 39. MFA

MFA إلزامي للـAdmin والعمليات المالية الحساسة.

---

# 40. Audit Logs

سجل على الأقل:

```text
who
what
target
before
after
timestamp
IP/context where legally appropriate
request/correlation ID
reason
```

خصوصًا:

- procurement approval.
- fitment override.
- seller blocking.
- refunds.
- price overrides.
- permissions.

---

# 41. Observability

صمم:

```text
structured logs
metrics
tracing
error tracking
business metrics
```

مع correlation ID عبر:

```text
request
payment
order
procurement
shipment
webhook
```

ادرس:

```text
Sentry
OpenTelemetry
Prometheus/Grafana
managed cloud observability
```

ولا تضف ELK تلقائيًا إن كان أكثر تعقيدًا من حاجة MVP.

---

# 42. Background Jobs

حدد jobs مثل:

```text
listing refresh
supplier availability refresh
price refresh
seller-score recalculation
search indexing
token refresh
tracking refresh
stale-order detection
payment reconciliation
notification retries
```

قارن BullMQ/Redis أو managed queue.

---

# 43. Caching

استخدم caching فقط حيث توجد فائدة.

حدد TTL مختلف لـ:

```text
OAuth application token
catalog metadata
VIN results
TecDoc lookup
eBay listing
shipping quote
search result
seller score
```

لا cache للأسعار بصورة قد تؤدي لبيع بسعر قديم.

---

# 44. Resilience

لكل external provider:

```text
timeout
retry
backoff
jitter
circuit breaker
rate limiter
bulkhead
fallback
dead-letter handling
```

لكن لا retry على العمليات المالية بشكل أعمى.

---

# 45. AI

استخدم AI فقط عندما يضيف قيمة.

حالات مناسبة:

```text
query understanding
Bulgarian/German automotive synonym expansion
listing normalization
attribute extraction
DTC explanation
support assistant
fitment evidence summarization
duplicate detection
```

لا تسمح لـLLM بأن يكون المصدر النهائي لقرار fitment الحرج.

---

# 46. Fitment Decision Hierarchy

مثال:

```text
Tier 1 — authoritative structured evidence
OEM
TecDoc
exact vehicle/engine relation

Tier 2 — supplier structured fitment

Tier 3 — listing attributes/text

Tier 4 — AI inference
```

لا يستطيع Tier 4 تجاوز تعارض في Tier 1.

---

# 47. SEO

أنشئ strategy لـ:

```text
category pages
brand pages
vehicle pages
part pages
OEM pages
informational automotive content
structured data
canonical URLs
indexation
sitemaps
faceted navigation
duplicate content
German supplier descriptions
AI translations
```

تجنب indexing صفحات search عديمة القيمة.

---

# 48. i18n

الأساس:

```text
bg
en
```

لكن البيانات القادمة من eBay DE غالبًا ألمانية.

لذلك صمم:

```text
source text
normalized attributes
translated display fields
translation provenance
```

ولا تستبدل source data الأصلية بالكامل.

---

# 49. Analytics

حدد funnel:

```text
landing
→ search
→ vehicle selected
→ product viewed
→ fitment confirmed
→ add to cart
→ checkout
→ payment
→ procurement
→ shipped
→ delivered
```

Events أساسية:

```text
search_submitted
vin_added
vehicle_selected
fitment_warning_seen
product_viewed
add_to_cart
checkout_started
payment_authorized
order_created
procurement_failed
order_shipped
return_requested
```

---

# 50. KPIs

أدرج:

```text
Search-to-product CTR
Add-to-cart rate
Checkout conversion
Paid-order conversion
Fitment confidence distribution
Wrong-fit return rate
Overall return rate
Procurement success rate
Supplier stock-failure rate
Supplier price-change rate
Order contribution margin
Payment failure rate
Median procurement time
Median delivery time
Refund cycle time
Customer support contacts/order
Repeat purchase rate
```

---

# 51. أهداف SPEC الحالية

راجع الأهداف الحالية الموجودة في `START_MEIN_PLAN_1.0.md`.

منها أفكار مثل:

```text
search-to-payment speed
fitment accuracy
wrong-fit returns
semi-automatic procurement time
```

لا تقبل الرقم الموجود لمجرد أنه مكتوب.

صنف كل KPI إلى:

```text
Existing Target
Validated Target
Needs Baseline
Needs Revision
```

---

# 52. اختبارات

اكتب Test Strategy كاملة:

## Unit

Business rules.

## Integration

DB + Redis + suppliers.

## Contract

eBay/TecDoc/providers.

## E2E

```text
Search
→ vehicle
→ part
→ cart
→ checkout
→ procurement
→ tracking
```

## Security

SAST/DAST/dependency scanning.

## Load

search/import/webhooks.

## Chaos/failure

supplier timeout/token expiry/payment duplicate.

---

# 53. Dry Run

قبل real procurement automation:

نفذ Phase تشغيل تجريبي.

مثال:

```text
system proposes action
human executes/verifies
system compares predicted vs actual
```

اجمع:

```text
price mismatches
inventory mismatches
shipping mismatches
fitment problems
supplier failures
```

---

# 54. Go/No-Go Automation Gate

لا يتم الانتقال إلى full automation إلا بعد checklist صارمة.

أنشئ checklist لا تقل عن 30 شرطًا.

تشمل على الأقل:

```text
official eBay permission confirmed
production access confirmed
checkout path confirmed
cross-border shipping confirmed
legal model confirmed
VAT confirmed
payments reconciled
idempotency tested
refunds tested
returns tested
seller scoring operating
fitment accuracy measured
fraud controls operating
admin emergency stop working
audit logging working
monitoring working
secrets production-ready
load tests passed
security review passed
disaster recovery tested
```

---

# 55. Emergency Kill Switches

يجب توفير:

```text
DISABLE_EBAY_SYNC
DISABLE_AUTOMATIC_PROCUREMENT
DISABLE_CHECKOUT
DISABLE_NEW_ORDERS
DISABLE_SELLER
DISABLE_PAYMENT_CAPTURE
```

من خلال feature flags/secure admin controls.

---

# 56. CI/CD

افحص GitHub repository الفعلي إن كان متاحًا.

صمم:

```text
lint
typecheck
unit
integration
build
security scan
migration check
deploy staging
smoke test
manual production approval
deploy production
```

لا تسمح لنشر Production إذا فشلت gates.

---

# 57. Environments

حدد:

```text
local
test
staging
production
```

مع فصل:

```text
DB
Redis
Stripe
eBay
TecDoc/provider
secrets
webhooks
```

---

# 58. Infrastructure

قارن قبل الاختيار:

```text
GCP
AWS
Azure
managed container platforms
```

ولا تستخدم Kubernetes إلا إذا كانت فائدته الحالية مبررة.

يجب حساب:

```text
monthly MVP cost
10k users
100k users
1M users
```

على مستوى تقريبي مع assumptions واضحة.

---

# 59. Backups & DR

حدد:

```text
RPO
RTO
database backups
point-in-time recovery
restore test
secret recovery
search index rebuild
```

---

# 60. ملفات المشروع

اقترح repository structure مثل:

```text
Koli_Parts_Root/
│
├── apps/
│   ├── web/
│   ├── api/
│   └── worker/                 # only if justified
│
├── packages/
│   ├── database/
│   ├── contracts/
│   ├── config/
│   ├── auth/
│   ├── ui/
│   ├── search/
│   └── automotive/
│
├── db/
│   ├── migrations/
│   └── seeds/
│
├── docs/
│   ├── MASTER_PLAN_2.0.md
│   ├── ARCHITECTURE.md
│   ├── EBAY_FEASIBILITY_MATRIX.md
│   ├── EBAY_INTEGRATION.md
│   ├── AUTH_SSO.md
│   ├── DATA_MODEL.md
│   ├── FITMENT_ENGINE.md
│   ├── SECURITY.md
│   ├── COMPLIANCE.md
│   ├── RUNBOOK.md
│   └── ADR/
│
├── infra/
│
├── scripts/
│
├── .github/
│   └── workflows/
│
├── .env.example
├── package.json
├── turbo.json
└── README.md
```

لكن أولًا قارن بالهيكل الحقيقي الموجود.

لا تحذف أو تنقل ملفات قبل فهمها.

---

# 61. Architecture Decision Records

أي قرار مهم يجب أن يصبح ADR.

على الأقل:

```text
ADR-001 Repository architecture
ADR-002 Authentication/SSO
ADR-003 Database
ADR-004 Search engine
ADR-005 eBay integration model
ADR-006 Procurement strategy
ADR-007 Payments
ADR-008 TecDoc
ADR-009 VIN provider
ADR-010 Cloud/deployment
ADR-011 Queue/jobs
ADR-012 Product/catalog model
```

---

# 62. Audit الملفات الموجودة

في بداية المهمة افحص:

```text
package.json
package-lock.json
turbo.json
.env.example
.gitignore
START_MEIN_PLAN_1.0.md
apps/**
packages/**
db/**
docs/**
infra/**
```

ثم اكتب:

```text
CURRENT_STATE_AUDIT
```

يشمل:

```text
Exists
Implemented
Partially Implemented
Placeholder
Incorrect
Contradictory
Missing
Deprecated
Risky
```

---

# 63. تعارض يجب التحقيق فيه

هناك تعارض معروف في المواد الحالية:

بعض الملفات تصف Koli Parts بأنه:

```text
AI-driven auto parts marketplace
B2B wholesale from Germany
```

بينما SPEC يركز على:

```text
eBay DE dropshipping
```

لا تتجاهل هذا التعارض.

حدد ما إذا كان:

```text
A — eBay-only
B — German B2B wholesale
C — Hybrid multi-supplier
```

هو النموذج النهائي.

والتوجه المعماري المفضل مبدئيًا هو ألا نجعل Koli Parts رهينة لمورد واحد.

لكن لا تغير business model من نفسك.

---

# 64. .env Audit

افحص `.env.example`.

أنشئ جدول:

```text
Variable
Exists?
Needed?
Environment
Secret?
Owner
Purpose
Remove/Keep/Add
```

وتحقق من:

```text
DATABASE
REDIS
KOLI ONE AUTH
EBAY
TECDOC
VIN
STRIPE
PAYPAL
ECONT
SEARCH
SENTRY
QUEUE
ENCRYPTION
WEBHOOKS
APP URLS
```

---

# 65. لا تُسرّب الأسرار

إذا وجدت secret حقيقيًا في الملفات:

لا تكرره في الرد.

اكتب:

```text
SECRET DETECTED — ROTATION REQUIRED
```

وحدد الملف والمفتاح فقط دون القيمة.

---

# 66. دراسة السوق

نفذ دراسة حديثة لسوق بلغاريا 2026.

ابحث عن:

- Bulgarian parts marketplaces.
- parts retailers.
- used-parts platforms.
- German competitors.
- cross-border purchase behavior.
- delivery expectations.
- pricing.
- search experience.
- VIN search adoption.
- workshop workflows.

افصل:

```text
Evidence
Inference
Recommendation
```

---

# 67. Personas

أنشئ personas رئيسية:

```text
DIY private owner
car enthusiast
budget buyer
mechanic
independent workshop
small dealer
fleet
parts reseller
```

حدد أهم workflows لكل واحدة.

---

# 68. MVP

لا تجعل MVP يحتوي كل فكرة في المشروع.

حدد أصغر منتج قادر على إثبات:

```text
Can Bulgarian users find the correct part,
trust compatibility,
pay successfully,
and receive it profitably?
```

MVP يجب أن يركز على:

```text
identity
vehicle
VIN/OEM search
catalog
eBay/supplier discovery
fitment
cart
pricing
checkout
semi-manual procurement
tracking
admin
returns foundation
```

---

# 69. مراحل المشروع

ابنِ Roadmap من 0 إلى 36 أسبوعًا، لكن لا تعتبر 36 أسبوعًا وعدًا ثابتًا.

مثال هيكلي:

```text
Phase 0 — Feasibility & Audit
Phase 1 — Architecture Foundation
Phase 2 — Catalog & Supplier Discovery
Phase 3 — Vehicle/VIN/Fitment
Phase 4 — Search UX
Phase 5 — Cart/Pricing/Payments
Phase 6 — Semi-Automatic Procurement
Phase 7 — Admin Operations
Phase 8 — Returns/Finance/Reconciliation
Phase 9 — Intelligence
Phase 10 — Automation
Phase 11 — Production Hardening
Phase 12 — Bulgaria Launch
Phase 13 — EU Expansion
```

---

# 70. لكل مرحلة

قدم:

```text
Goal
Business Value
Scope
Out of Scope
Dependencies
Technical Tasks
Product Tasks
Legal Tasks
External Dependencies
Risks
Tests
Acceptance Criteria
KPIs
Go/No-Go
Definition of Done
```

---

# 71. GitHub Epics

حوّل الخطة إلى Epics.

مثال:

```text
EPIC-00 Project Audit
EPIC-01 eBay Feasibility
EPIC-02 Identity & Koli One SSO
EPIC-03 Automotive Catalog
EPIC-04 VIN
EPIC-05 TecDoc
EPIC-06 Fitment Engine
EPIC-07 Supplier Platform
EPIC-08 Search
EPIC-09 Pricing
EPIC-10 Checkout
EPIC-11 Payments
EPIC-12 Procurement
EPIC-13 Fulfillment
EPIC-14 Admin
EPIC-15 Returns
EPIC-16 Security
EPIC-17 Observability
EPIC-18 Compliance
EPIC-19 Analytics
EPIC-20 Production Launch
```

---

# 72. GitHub Issues

لكل Epic أنشئ issues atomic.

كل issue يحتوي:

```text
Title
Why
Scope
Technical Notes
Dependencies
Acceptance Criteria
Tests
Security Considerations
Observability
Definition of Done
Estimate
```

لا تستخدم issues مثل:

```text
Build backend
```

بل tasks صغيرة قابلة للتحقق.

---

# 73. Dependency Graph

أنشئ dependency graph يمنع ترتيب العمل الخاطئ.

مثال:

```text
eBay feasibility
     ↓
supplier architecture
     ↓
catalog normalization
     ↓
search
```

و:

```text
Koli One auth audit
     ↓
SSO ADR
     ↓
users/auth implementation
```

---

# 74. Critical Path

حدد Critical Path الحقيقي للإطلاق.

لا تجعل UI visual polish يحجب eBay approval أو fitment data licensing.

---

# 75. Risk Register

أنشئ Risk Register.

على الأقل:

```text
R-001 eBay Buy API production rejection
R-002 cross-border checkout restriction
R-003 dropshipping policy incompatibility
R-004 TecDoc licensing delay
R-005 poor fitment accuracy
R-006 supplier stock mismatch
R-007 supplier price changes
R-008 seller invoice exposure
R-009 returns cost
R-010 payment/procurement mismatch
R-011 VAT errors
R-012 SSO security flaw
R-013 fraud
R-014 supplier dependency
R-015 search quality
R-016 data rights/licensing
```

لكل خطر:

```text
Probability
Impact
Severity
Trigger
Mitigation
Contingency
Owner
```

---

# 76. Business Feasibility

ابنِ unit economics.

مثال:

```text
Customer Price
- Supplier Price
- Supplier Shipping
- Payment Fee
- VAT effect
- Customer Support Allocation
- Expected Return Cost
- Expected Fraud Loss
- Infrastructure Allocation
= Contribution Margin
```

احسب سيناريوهات:

```text
€25 order
€50
€100
€250
€500
```

ولا تعتبر 6% margin ناجحًا تلقائيًا.

---

# 77. Break-even

احسب:

```text
minimum margin
minimum average order value
maximum tolerable return rate
maximum procurement failure rate
CAC ceiling
```

بافتراضات معلنة.

---

# 78. Returns

صمم workflow كاملًا:

```text
request
→ reason
→ eligibility
→ evidence
→ supplier policy
→ return address
→ shipping
→ supplier refund
→ customer refund
→ reconciliation
```

افصل:

```text
wrong fit
damaged
not as described
changed mind
supplier error
Koli Parts fitment error
```

---

# 79. Fitment Error Economics

تتبع:

```text
FITMENT_ERROR_KOLI
FITMENT_ERROR_SUPPLIER
CUSTOMER_WRONG_VEHICLE
CUSTOMER_IGNORED_WARNING
UNKNOWN
```

هذه البيانات ستطور Fitment Engine لاحقًا.

---

# 80. Notifications

صمم:

```text
email
push future
in-app
SMS only if justified
```

لـ:

```text
order confirmed
procurement delayed
supplier unavailable
shipping
delivered
return
refund
security
```

---

# 81. Customer Support

حدد Support Console يحتاج:

```text
user
vehicle
order
supplier
payment
procurement
tracking
fitment evidence
audit trail
conversation history
```

مع إخفاء البيانات الحساسة حسب role.

---

# 82. OpenAPI

بعد تثبيت architecture، صمم OpenAPI كاملًا على مستوى المجالات:

```text
/auth
/users
/vehicles
/vin
/search
/products
/listings
/cart
/quotes
/orders
/payments
/procurements
/shipments
/returns
/admin
/webhooks
/integrations/ebay
```

لا تكتب endpoints توحي بأن external capability موجودة قبل إثباتها.

بدل:

```text
POST /ebay/buy
```

إذا capability غير مؤكدة، استخدم abstraction داخل Procurement domain.

---

# 83. Webhooks

صمم generic webhook ingestion:

```text
provider
eventId
eventType
payloadHash
receivedAt
verifiedAt
processedAt
status
retryCount
```

الخطوات:

```text
receive
→ verify
→ deduplicate
→ persist
→ acknowledge
→ async process
```

---

# 84. Data Migration

ضع استراتيجية migrations:

```text
forward migration
backward-compatible deploys
rollback strategy
seed data
test DB
production safeguards
```

---

# 85. Search Index Rebuild

يجب أن يكون index مشتقًا من canonical data، وقابلًا لإعادة البناء.

لا تجعل search engine source of truth.

---

# 86. Source of Truth Matrix

أنشئ جدولًا مثل:

```text
User Identity        → Koli One/Auth
Vehicle VIN          → VIN provider + normalized DB
TecDoc Fitment       → TecDoc
Canonical Product    → Koli Parts DB
Supplier Price       → Supplier
Supplier Stock       → Supplier
Order                → Koli Parts
Payment              → PSP
Procurement          → Koli Parts + Supplier confirmation
Tracking             → Supplier/carrier
Search Index         → Derived
```

---

# 87. Documentation Outputs

بعد التحليل، أنشئ على الأقل:

```text
docs/MASTER_PLAN_2.0.md
docs/CURRENT_STATE_AUDIT.md
docs/EBAY_FEASIBILITY_MATRIX.md
docs/EBAY_INTEGRATION.md
docs/AUTH_SSO.md
docs/ARCHITECTURE.md
docs/DATA_MODEL.md
docs/FITMENT_ENGINE.md
docs/SEARCH_ARCHITECTURE.md
docs/PROCUREMENT.md
docs/PAYMENTS.md
docs/SECURITY.md
docs/COMPLIANCE.md
docs/RISK_REGISTER.md
docs/ROADMAP.md
docs/TEST_STRATEGY.md
docs/GO_NO_GO.md
```

---

# 88. MASTER_PLAN_2.0

هذه الوثيقة يجب أن تصبح المرجع الجديد بعد `START_MEIN_PLAN_1.0.md`.

لكن لا تحذف الملف القديم.

احتفظ به كسجل تاريخي.

في Master Plan اكتب:

```text
Previous Assumption
Current Finding
Decision
Reason
Evidence
Impact
```

لكل تغيير مهم.

---

# 89. لا تغير Source of Truth بصمت

إذا وجدت أن `START_MEIN_PLAN_1.0.md` يحتوي معلومة خاطئة:

لا تغيرها سرًا.

اكتب:

```text
CORRECTION CANDIDATE
```

واشرح السبب.

---

# 90. المخرجات النهائية المطلوبة من هذه المهمة

أريد الرد النهائي بهذا الترتيب الإجباري:

## PART A — Executive Verdict

هل المشروع قابل للتنفيذ بالنموذج الحالي؟

```text
YES
YES WITH CONDITIONS
NO — MODEL CHANGE REQUIRED
```

مع الأسباب.

---

## PART B — Current Repository Audit

ما الموجود فعليًا الآن؟

---

## PART C — Contradictions Found

كل التعارضات بين:

```text
files
SPEC
architecture
business model
eBay capabilities
```

---

## PART D — eBay 2026 Feasibility

تفصيل صارم مع مصادر eBay الرسمية.

---

## PART E — Final Business Model

ارسم supply/payment/legal/customer flow.

---

## PART F — Final System Architecture

أعطني Mermaid diagrams تشمل:

```text
Context Diagram
Container Diagram
Order Flow
SSO Flow
Supplier Flow
Fitment Flow
Data Flow
Deployment
```

---

## PART G — Koli One ↔ Koli Parts Integration

تفصيل SSO الكامل بين:

```text
koli.one
```

و:

```text
koli-one.com
```

---

## PART H — Domain Architecture

DNS/subdomains/TLS/cookies/CORS/redirects/security.

---

## PART I — Data Architecture

ERD + ownership + lifecycle.

---

## PART J — eBay Integration

من developer account حتى Production.

---

## PART K — TecDoc/VIN/Fitment

كل تفاصيل matching.

---

## PART L — Search Architecture

اختيار التقنية وتبريرها.

---

## PART M — Checkout/Payments/Procurement

الحالات الطبيعية والفشل.

---

## PART N — Admin & Operations

كيف يدير الفريق المنصة يوميًا.

---

## PART O — Security

Threat model + controls.

---

## PART P — Legal/Compliance

Bulgarian/EU/eBay requirements مع مصادر حديثة.

---

## PART Q — Infrastructure & DevOps

Local/staging/prod/CI/CD/monitoring/backups.

---

## PART R — Testing

كل طبقات الاختبار.

---

## PART S — Roadmap 0–36 Weeks

بالأسبوع والمراحل.

---

## PART T — GitHub Epics & Issues

بالترتيب التنفيذي الصحيح.

---

## PART U — Risk Register

تقني وتجاري وقانوني وتشغيلي.

---

## PART V — Unit Economics

هل الربح واقعي؟

---

## PART W — Automation Maturity Plan

من manual إلى full automation.

---

## PART X — 30+ Point Go/No-Go Checklist

قبل full automatic procurement.

---

## PART Y — Decisions Requiring Human/External Approval

قسمها:

```text
OWNER DECISION
EBAY DECISION
LEGAL DECISION
ACCOUNTANT DECISION
SUPPLIER DECISION
TECDOC/VIN PROVIDER DECISION
```

---

## PART Z — Exact Next Actions

في النهاية أعطني بالضبط:

```text
Action 1
Action 2
Action 3
...
```

بحيث يستطيع فريق التطوير بدء التنفيذ فورًا.

---

# 91. الأسئلة غير المحسومة

لا توقف المهمة بأسئلة يمكن التعامل معها بافتراض مؤقت.

بدل ذلك أنشئ:

```text
ASSUMPTION REGISTER
```

لكن أبرز القرارات الحساسة التي تحتاج موافقة لاحقة، ومنها:

- هل `koli-one.com` سيكون الدومين النهائي العام لـKoli Parts؟
- Merchant of Record.
- final return policy.
- who pays return shipping.
- supplier account ownership.
- eBay purchase model.
- whether eBay approves Buy Order APIs.
- German forwarding/warehouse need.
- TecDoc contract.
- VIN provider.
- payment authorization/capture strategy.
- PayPal inclusion in MVP.
- final margin model.
- seller quality thresholds.
- used-parts scope.
- hazardous parts restrictions.

---

# 92. معيار الجودة

لا أريد:

```text
generic roadmap
generic SaaS architecture
generic e-commerce advice
```

أريد خطة مخصصة تحديدًا لـ:

```text
Koli Parts
Bulgaria
automotive parts
Koli One
koli.one
koli-one.com
eBay Germany
developer.ebay.com
VIN
OEM
TecDoc
DTC
fitment
dropshipping/procurement
Bulgarian buyers
EU compliance
```

---

# 93. قاعدة Production-Grade

لكل قرار اسأل:

```text
Is it correct?
Is it permitted?
Is it secure?
Is it scalable?
Is it maintainable?
Is it measurable?
Is it operationally manageable?
Is it profitable?
Is it appropriate for Bulgaria?
Does it reduce wrong-part purchases?
```

---

# 94. لا تنفذ حلًا متوسطًا

إذا وجدت أن إحدى الأفكار السابقة غير صحيحة:

صححها.

إذا كان API غير مناسب:

لا تستخدمه.

إذا كان architecture مبالغًا فيه:

بسّطه.

إذا كان هامش الربح غير كافٍ:

أثبت ذلك.

إذا كان dropshipping من eBay غير قابل للأتمتة رسميًا:

لا تتحايل على eBay؛ صمم البديل الصحيح.

إذا كانت الخطة القديمة تتعارض مع repository الحقيقي:

repository + verified requirements هما الحقيقة.

---

# 95. أول شيء تفعله الآن

ابدأ الآن داخل:

```text
C:\Users\hamda\Desktop\Koli_Parts_Root
```

ونفذ أولًا:

```text
1. Inspect complete repository tree
2. Read START_MEIN_PLAN_1.0.md completely
3. Read package.json
4. Inspect apps/web
5. Inspect apps/api
6. Inspect packages
7. Inspect .env.example without exposing secrets
8. Inspect turbo.json
9. Inspect current Git status/history if available
10. Identify what is already implemented
11. Compare implementation against SPEC
12. Research developer.ebay.com
13. Prove or reject the eBay procurement assumptions
14. Research current Bulgarian/EU requirements from authoritative sources
15. Produce CURRENT_STATE_AUDIT
16. Produce EBAY_FEASIBILITY_MATRIX
17. Produce MASTER_PLAN_2.0
18. Build the complete dependency-ordered roadmap
```

---

# 96. شرط نهائي

لا تبدأ implementation واسع قبل الإجابة على السؤال الأخطر:

```text
Can Koli Parts legally, contractually and technically execute
the intended eBay Germany → Bulgaria procurement flow
using supported eBay mechanisms in Production?
```

هذا السؤال هو:

```text
GATE-0
```

إذا فشل:

لا يفشل مشروع Koli Parts.

بل تتغير فقط Procurement/Supplier Strategy مع الإبقاء على:

```text
VIN
TecDoc
OEM
Fitment
Search
Catalog
Koli One SSO
Checkout UX
Admin
Intelligence
```

كمكونات استراتيجية للمشروع.

الهدف ليس بناء “eBay wrapper”.

الهدف هو بناء:

> **أفضل منصة ذكية لاكتشاف وشراء قطعة السيارة الصحيحة للمستخدم البلغاري، مع بنية توريد يمكنها استخدام eBay DE في البداية حيث يكون ذلك ممكنًا، لكنها لا تعتمد عليه معماريًا أو تجاريًا كقيد أبدي.**

ابدأ الآن بالتدقيق والبحث والخطة الرئيسية، وبصرامة Production Grade.

هذه النسخة أقوى من البرومت القديم تحديدًا لأنها تمنع النموذج من بناء architecture كامل فوق افتراض eBay غير مثبت، وتلزمه بفحص ما أنشئ بالفعل بدل إعادة scaffold المشروع. كما أنها تحفظ الميزة الأساسية في SPEC الحالي: VIN/TecDoc/OEM، مؤشر التوافق، التنفيذ شبه الآلي أولًا، ثم الأتمتة بعد اجتياز شروط واضحة.

ونقطة **GATE-0** مهمة جدًا: eBay توضح أن Buy API production access مخصص للشركاء ويحتاج موافقات، وأن ألمانيا `EBAY_DE` مدعومة ضمن Buy APIs، لكن دعم marketplace لا يعني تلقائيًا أن نموذج checkout العابر من ألمانيا إلى بلغاريا مسموح للنموذج التجاري المطلوب. لذلك يجب إثبات هذه النقطة قبل جعل “الشراء الآلي من eBay” العمود الفقري لـKoli Parts.
------------------------------------------------------

إذا كان هدفك أن تكون Koli Parts امتدادًا بصريًا حقيقيًا لـ Koli One وليست واجهة “مشابهة” فقط، فالبرومت السابق غير صارم بما يكفي. لا يجوز للنموذج أن يخترع HEX أو الخطوط أو الـspacing ثم يقول إنها مطابقة لـKoli One. يجب أن تكون القاعدة: افحص Koli One الفعلي أولًا، واستخرج منه نظام التصميم حرفيًا، ثم طبّقه على Koli Parts.
الخطة الحالية أصلًا تحدد Next.js وواجهات البحث وVIN والمنتج والعربة وi18n، لكنها لا تحتوي Design System أو هوية بصرية مفصلة. START_MEIN_PLAN_1.0.mdMD وبالتالي يجب إضافة مرحلة مستقلة اسمها مثلًا KOLI_ONE_VISUAL_PARITY_AUDIT.
استبدل جزء الهوية البصرية في البرومت السابق بهذا النص الأكثر صرامة:
KOLI ONE → KOLI PARTS VISUAL PARITY — NON-NEGOTIABLE REQUIREMENT
Koli Parts ليست علامة بصرية منفصلة عن Koli One.
يجب أن يشعر المستخدم أن:
Koli One +
Koli Parts
=

One Product Ecosystem
وليس موقعين تم تصميمهما بواسطة فريقين مختلفين.
القاعدة الأساسية
ممنوع اختراع:
ألوان جديدة

Fonts جديدة

Border radius جديد

Shadows جديدة

Spacing system جديد

Button styles جديدة

Forms جديدة

Navbar مختلفة

Cards مختلفة

Icon language مختلفة

Animation language مختلفة

إلا إذا كان هناك سبب Product/UX موثق وموافقة واضحة.

1. Source of Truth
   قبل تصميم Koli Parts، افحص Koli One الفعلي.
   استخدم بالترتيب:
   مستودع GitHub الحالي لـ Koli One.

ملفات frontend الفعلية.

Tailwind/CSS/design-token configuration.

global.css / theme files.

UI component library.

Fonts.

Logos/assets.

Navbar/Header.

Footer.

Buttons.

Inputs.

Cards.

Modals/Drawers.

Forms.

Mobile layouts.

Responsive breakpoints.

Animations.

Light/Dark behavior إن وجد.

Figma إن كان موجودًا.

Production UI كمرجع ثانوي للتحقق.

ممنوع الاعتماد على الذاكرة أو الوصف النصي وحده.

2. Visual Audit
   أنشئ:
   docs/design/KOLI_ONE_VISUAL_AUDIT.md
   يحتوي على:
   Colors
   استخرج القيم الحقيقية:
   primary
   secondary
   accent
   background
   surface
   surface-elevated
   border
   text-primary
   text-secondary
   text-muted
   success
   warning
   error
   info
   مع:
   HEX
   RGB
   HSL/OKLCH where applicable
   CSS variable
   Tailwind token
   Source file

3. Typography
   استخرج الخط الحقيقي المستخدم في Koli One.
   حدد:
   font family
   fallback stack
   font weight
   font size
   line height
   letter spacing
   لكل:
   Display
   H1
   H2
   H3
   H4
   Body Large
   Body
   Body Small
   Label
   Caption
   Button
   Price
   لا تستخدم خطًا جديدًا لمجرد أنه يبدو أفضل.

4. Layout System
   استخرج:
   container widths
   grid
   gutters
   spacing scale
   section spacing
   card spacing
   header height
   mobile padding
   desktop padding
   breakpoints
   Koli Parts يجب أن تستخدم نفس rhythm البصري.

5. Shape Language
   استخرج:
   border-radius
   border width
   card radius
   button radius
   input radius
   modal radius
   image radius

6. Elevation
   استخرج:
   shadows
   glass effects
   blur
   backdrop-filter
   surface elevation
   hover elevation
   ولا تبالغ في glassmorphism إذا لم يكن مستخدمًا فعليًا في Koli One.

7. Motion
   استخرج:
   hover timing
   page transition
   dropdown animation
   modal animation
   drawer animation
   button feedback
   loading state
   skeleton behavior
   حدد:
   duration
   easing
   transform
   opacity
   مع احترام:
   prefers-reduced-motion

8. Shared Component Strategy
   الهدف الهندسي النهائي يجب أن يكون، حيثما كان ذلك واقعيًا:
   packages/
   └── design-system/
   أو ما يتناسب مع الـmonorepo الحقيقي.
   يدعم:
   Koli One
   Koli Parts
   Future Koli products
   بدل نسخ CSS يدويًا بين المشاريع.
   افحص أولًا ما إذا كان Koli One يحتوي أصلًا على reusable design package.
   إذا كان موجودًا:
   استخدمه.
   إذا لم يكن موجودًا:
   اقترح extraction تدريجيًا بدون كسر Koli One Production.

9. Brand Architecture
   يجب الحفاظ على هوية Koli One الرئيسية.
   لكن Koli Parts يمكن أن تمتلك product designation واضحًا مثل:
   Koli
   Parts
   دون إنشاء Brand مستقلة بصريًا.
   حدد نظامًا واضحًا لـ:
   Master Brand
   Product Name
   Logo Lockup
   Favicon
   App Icon
   Browser Title
   Navigation Context

10. Logo
    لا تخترع Logo جديدًا قبل فحص أصول Koli One.
    حدد:
    primary logo
    compact logo
    icon-only
    light-background version
    dark-background version
    minimum size
    clear space
    incorrect usage
    وحدد كيف يظهر:
    Koli One
    Koli Parts
    ضمن نفس Brand Family.

11. Header
    Koli Parts يجب أن تحافظ على mental model الخاص بـKoli One.
    قارن Header الفعلي لـKoli One ثم حدد:
    logo
    search
    navigation
    language
    garage
    favorites if applicable
    cart
    account
    mobile menu
    يجب ألا يشعر المستخدم أنه خرج من ecosystem عند الانتقال بين Koli One وKoli Parts.

12. Cross-Product Navigation
    صمم انتقالًا واضحًا:
    Koli One → Cars
    Koli Parts → Parts
    مع الحفاظ على:
    identity
    navigation language
    user avatar
    user account
    saved state where appropriate

13. Koli Parts Home
    لا تنسخ Homepage الخاصة بالسيارات حرفيًا.
    استخدم نفس Design System ولكن UX خاص بقطع السيارات.
    Above the fold يجب أن يركز على:
    Find the right part for your car
    مع الخيارات الأساسية:
    VIN
    Vehicle
    OEM Number
    Part Name
    ثم categories / recommendations / trust.

14. Search Experience
    الشاشة الرئيسية لـKoli Parts يجب أن تعطي الأولوية لـ:
    Vehicle Context

-

Part Search
وليس مجرد search input تقليدي.
المستخدم الذي يحدد سيارته يجب أن يرى سياقًا دائمًا مثل:
Searching parts for:

Opel Astra J
2012
1.7 CDTI
مع إمكانية تغيير السيارة بسرعة.

15. Product Card
    صمم ProductCard بنفس DNA البصري لـKoli One.
    لكن أضف معلومات Parts-specific:
    image
    part title
    brand
    condition
    OEM
    price
    delivery
    seller/source
    compatibility status
    compatibility confidence
    أهم عنصر بعد السعر:
    FITMENT STATUS

16. Compatibility Component
أنشئ component مميزًا ضمن Design System:
<FitmentStatus />

يدعم حالات مثل:
Confirmed Fit
High Confidence
Check OEM
Unknown
Not Compatible
ولا يعتمد فقط على اللون.
استخدم:
icon
text
status label
explanation
لأسباب accessibility.

17. Product Page
    يجب الحفاظ على Design DNA لـKoli One مع إعادة تنظيم الصفحة حسب شراء القطعة.
    Desktop:
    Image Gallery
    |
    | Product Information
    | Compatibility
    | Price
    | Shipping
    | CTA
    ثم:
    Compatibility Details
    OEM Numbers
    Vehicle Fitment
    Specifications
    Seller
    Shipping
    Returns
    Related Parts
    Mobile:
    ضع CTA بطريقة مناسبة للموبايل ويمكن دراسة sticky purchase bar.

18. Cart & Checkout
    استخدم المكونات والنمط البصري نفسه الخاص بـKoli One حيثما كان مناسبًا.
    لكن أظهر قبل الدفع:
    Vehicle
    Fitment Status
    Supplier Availability
    Delivery
    VAT
    Final Price
    ويجب إبراز أي منتج:
    Compatibility not confirmed
    قبل إكمال الشراء.

19. User Account
    الحساب موحد على مستوى ecosystem.
    لا تنشئ User Center بصريًا مختلفًا.
    حدد architecture تسمح مستقبلًا بـ:
    My Cars
    My Parts Orders
    Saved Vehicles
    Saved Parts
    Koli One Activity
    Koli Parts Activity
    ضمن تجربة متماسكة.

20. Admin UI
    Admin لا يجب بالضرورة أن يطابق consumer UI حرفيًا، لكنه يجب أن يستخدم نفس:
    tokens
    typography
    components
    status language
    spacing
    forms
    buttons
    مع density أعلى لتناسب العمليات.

21. Design Tokens Deliverable
    أنشئ:
    packages/design-system/tokens/
    أو المسار الأنسب حسب repository الحقيقي.
    مثل:
    colors.ts
    typography.ts
    spacing.ts
    radius.ts
    shadows.ts
    motion.ts
    breakpoints.ts
    z-index.ts
    وكذلك:
    tokens.css
    لكن جميع القيم يجب أن تكون مستخرجة من Koli One، لا مخترعة.

22. Component Inventory
    أنشئ:
    docs/design/COMPONENT_INVENTORY.md
    وصنف:
    EXACT REUSE
    REUSE WITH VARIANT
    KOLI PARTS NEW COMPONENT
    DEPRECATED
    مثال:
    Button EXACT REUSE
    Input EXACT REUSE
    Modal EXACT REUSE
    VehicleCard REUSE WITH VARIANT
    ProductCard KOLI PARTS NEW COMPONENT
    FitmentStatus KOLI PARTS NEW COMPONENT
    VINInput KOLI PARTS NEW COMPONENT

23. Visual Parity Matrix
    أنشئ:
    docs/design/VISUAL_PARITY_MATRIX.md
    بالأعمدة:
    Element
    Koli One Source
    Koli Parts Implementation
    Reuse %
    Difference
    Reason
    Approved?
    هدفنا:
    100% Design-System parity
    وليس بالضرورة:
    100% identical screen layouts
    الفرق مهم.
    Koli Parts يجب أن تستخدم نفس الهوية، ولكن UX الخاص بها يجب أن يخدم شراء قطع السيارات.

24. Screens Required
    صمم specification كاملة على الأقل لـ:
    Homepage
    Search Results
    VIN Selection
    Vehicle Garage
    Category
    Product Detail
    Cart
    Checkout
    Order Confirmation
    Orders
    Order Detail
    Account
    Authentication transition
    404
    Error
    Empty States
    Loading States

Admin Dashboard
Admin Procurement Queue
Admin Order
Admin Seller
Admin Fitment Review
Admin Returns

25. Responsive Requirements
    حدد كل شاشة لـ:
    Mobile
    Tablet
    Desktop
    Large Desktop
    Mobile First.
    اختبر خصوصًا:
    360
    390
    430
    768
    1024
    1280
    1440
    ولا تجعل desktop layout مجرد mobile ممتد.

26. Accessibility
    لا تقل عن WCAG 2.2 AA كهدف تصميمي.
    افحص:
    color contrast
    keyboard
    focus states
    labels
    error states
    screen readers
    semantic HTML
    touch targets
    reduced motion

27. Performance
    الهوية البصرية لا يجوز أن تضر الأداء.
    راقب:
    LCP
    CLS
    INP
    image loading
    font loading
    bundle size
    animation cost
    لا تستخدم video/3D/blur ثقيل دون business justification.

28. Figma
    إذا كانت Figma الخاصة بـKoli One متاحة:
    افحصها واستخدم Components/Tokens الموجودة.
    إذا لم تكن متاحة:
    لا تخترع رابط Figma.
    اكتب:
    FIGMA SOURCE NOT AVAILABLE
    وابنِ Design System Specification من production source code.

29. ممنوع
    ممنوع كتابة:
    Koli One uses #XXXXXX
    إلا إذا استخرجت اللون فعليًا من source of truth.
    وممنوع:
    Use Inter because it is modern
    إذا كان Koli One يستخدم خطًا آخر.
    وممنوع إنشاء Design System منفصل فقط لـKoli Parts بدون تبرير.

30. Required Deliverables
    أضف إلى الخطة النهائية:
    docs/design/KOLI_ONE_VISUAL_AUDIT.md
    docs/design/KOLI_PARTS_UX_ARCHITECTURE.md
    docs/design/VISUAL_PARITY_MATRIX.md
    docs/design/COMPONENT_INVENTORY.md
    docs/design/RESPONSIVE_SPEC.md
    docs/design/ACCESSIBILITY_SPEC.md
    وملفات Design System الفعلية عند بدء التنفيذ.

Final Principle
لا أريد:
“Koli Parts inspired by Koli One.”

ولا:
“Koli Parts has similar colors to Koli One.”

المطلوب:
Koli Parts is a first-party product inside the Koli ecosystem, using the actual Koli One visual language and shared design system, while introducing only the UX components required specifically for automotive parts discovery, fitment, purchasing, and fulfillment.

عند أي تعارض بين تخميناتك وبين الكود الفعلي لـKoli One:
KOLI ONE SOURCE CODE WINS.

وهناك فرق جوهري أريد تثبيته: “مطابق تمامًا” يجب أن يعني تطابق الهوية ونظام التصميم، وليس نسخ Layout صفحات Koli One حرفيًا. بيع سيارة وشراء حساس MAF عمليتان مختلفتان؛ نسخ نفس توزيع الشاشات سيضر UX. الصحيح أن الألوان، الخطوط، الأزرار، الـnavigation، الـspacing، الـmotion واللغة البصرية تكون واحدة، بينما Information Architecture وواجهات VIN/OEM/Fitment تكون مصممة خصيصًا لـKoli Parts.
أيضًا الـ.env.example الحالي فعليًا ما زال يعكس مرحلة مختلفة من المشروع؛ فهو يحتوي إعدادات B2B suppliers وEcont وStripe ولكنه لا يحتوي إعدادات eBay المطلوبة. .env.exampleEXAMPLE وهذا يؤكد أن الخطوة التالية الصحيحة ليست إضافة UI فقط، بل إعادة كتابة MASTER PLAN بعد تدقيق المشروع الحالي وKoli One معًا.

عالٍ
