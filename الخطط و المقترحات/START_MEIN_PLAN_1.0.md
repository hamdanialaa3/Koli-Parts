
### ملف الخطة الجذرية لمشروع Koli Parts

#### ملخص تنفيذي

**Koli Parts** منصة دروب شيبنج لقطع غيار السيارات مقرها بلغاريا، ثنائية اللغة البلغارية والإنجليزية، تستورد من  **eBay ألمانيا** . الهدف بناء منصة 2026 متكاملة: بحث ذكي مرتبط بـ  **VIN** ، مطابقة دقيقة عبر قواعد OEM وTecDoc، ربط بأكواد الأعطال DTC، اقتراحات جديدة ومستعملة، تنفيذ شراء آمن شبه آلي ثم آلي، ومؤشر ثقة رقمي لكل تطابق. هذا الملف هو المصدر الوحيد الذي يبدأ منه النموذج أو الفريق البرمجي لتنفيذ المشروع من الألف إلى الياء.

### نطاق المشروع والأهداف القابلة للقياس

* **نطاق أولي** : منتجات eBay DE فقط، سوق بلغاريا أولاً، ثم توسيع أوروبا.
* **أهداف قابلة للقياس**
  * زمن من بحث إلى دفع MVP ≤ 90 ثانية.
  * دقة توافق أولية ≥ 95% بعد دمج TecDoc.
  * نسبة مرتجعات بسبب عدم توافق ≤ 3% خلال 6 أشهر.
  * زمن تنفيذ الطلب (من دفع حتى شراء المورد) ≤ 6 ساعات في وضع شبه آلي.
* **مخرجات نهائية** : منصة Production قابلة للتوسع، لوحة إدارة، API موثّق (OpenAPI)، اختبارات تكاملية، خطة نشر وصيانة.

### مكونات النظام الأساسية والوظائف المطلوبة

1. **واجهة المستخدم Frontend**
   * **تقنية** : Next.js + TypeScript.
   * **وظائف** : بحث حر ذكي، اقتراحات فورية، إدخال VIN، قوائم منسدلة ديناميكية، صفحات منتج، عربة دفع، لوحة مستخدم، i18n بلغارية وإنجليزية.
2. **خادم API وطبقة الأعمال Backend**
   * **تقنية** : Node.js + TypeScript مع NestJS أو Fastify.
   * **وظائف** : إدارة مستخدمين، أوامر، تنفيذ شراء، إدارة توكنات eBay، واجهات adapter لـ eBay وTecDoc وموفري VIN.
3. **قاعدة بيانات وIndexing**
   * **تقنية** : PostgreSQL؛ Redis للكاش؛ Meilisearch أو OpenSearch أو Meilisearch + pgvector للبحث الدلالي.
   * **مخططات أساسية** : Users, Vehicles, VINRecords, Products, Listings, FitmentRules, Orders, Fulfillments, Sellers, SyncLogs.
4. **طبقة مطابقة القطع Matching Layer**
   * **وظيفة** : قواعد OEM، قواعد TecDoc، محرك قواعد + ML خفيف لتحسين الاقتراحات، حساب مؤشر ثقة رقمي لكل تطابق.
5. **خدمة VIN وبيانات المركبات**
   * **وظيفة** : فك تشفير VIN، ملء الحقول، ربط بالموديلات والمحركات وسنوات الإنتاج.
   * **مصادر** : TecDoc أو مزود VIN موثوق، تحديث دوري.
6. **تكامل eBay وعمليات الدروب شيبنج**
   * **APIs** : Identity OAuth2, Inventory/Feed, Order/Fulfillment, Marketing, Translation.
   * **سلوك** : مزامنة منتجات، تحديث مخزون، تنفيذ شراء شبه آلي ثم آلي، استلام أرقام تتبع.
7. **بوابات الدفع والشحن**
   * **تقنية** : Stripe + PayPal.
   * **وظيفة** : احتساب VAT حسب وجهة الشحن، رسوم شحن ديناميكية، دعم فواتير EU OSS.
8. **لوحة إدارة Admin**
   * **وظائف** : مراجعة وموافقة مزامنة المنتجات، تنفيذ أوامر شبه آلي، إدارة قواعد التوافق، قوائم بيضاء وسوداء للبائعين، تقارير ومراقبة.
9. **مراقبة وأمن**
   * **أدوات** : Sentry, Prometheus, Grafana, ELK.
   * **أمن** : تخزين مشفّر للتوكنات، Vault أو Secrets Manager، rate limiting، idempotency keys، audit logs.

### نموذج بيانات مبسّط (نماذج رئيسية)

* **Users** : id; email; passwordHash; preferredLanguage; savedVehicles.
* **Vehicles** : id; vin; brand; model; variant; year; engineCode; userId.
* **Products** : id; title; description; oemNumbers; images; attributes.
* **Listings** : id; productId; ebayItemId; sellerId; price; currency; quantity; shippingInfo; condition.
* **FitmentRules** : id; productId; vehicleCriteria; confidenceScore; source.
* **Orders** : id; userId; items; total; vat; shipping; status; fulfillmentId.
* **Fulfillments** : id; orderId; ebayOrderId; buyerAccount; trackingNumber; status.
* **SyncLogs** : id; source; action; timestamp; details.

### واجهات API أساسية ومخطط OpenAPI مختصر

 **مبادئ** : كل endpoint موثّق بـ OpenAPI، يدعم JSON، يستخدم JWT أو OAuth للمصادقة، كل استدعاء يملك idempotency-key عند إنشاء أوامر.

**أمثلة Endpoints**

* `POST /auth/ebay/callback` — تبادل authorization_code للحصول على access_token وrefresh_token.
* `GET /vehicles/parse-vin?vin={vin}` — فك تشفير VIN وإرجاع خصائص السيارة.
* `GET /search?q={query}&vin={vin}` — بحث هجيني يرد منتجات متوافقة مع مؤشر ثقة.
* `POST /orders` — إنشاء طلب داخلي بعد الدفع؛ يتطلب idempotency-key.
* `POST /fulfillments/execute` — تنفيذ شراء على eBay (شبه آلي أو آلي حسب الوضع).
* `POST /webhooks/ebay` — استقبال إشعارات eBay مثل shipment, order update.

**مخطط استجابة بحث مبسط**

json

```
{
  "query":"sensor maf opel",
  "vehicle":{"vin":"...","brand":"Opel","model":"Astra","year":2012},
  "results":[
    {"listingId":"...","productId":"...","title":"...","price":45.00,"currency":"EUR","condition":"new","compatibilityScore":97,"oemMatches":["12345678"]}
  ],
  "suggestions":{"alternatives":[...],"maintenanceRecommendations":[...]}
}
```

### تدفق الطلب التفصيلي من المستخدم إلى الشحن

1. **بحث وتحديد السيارة** : المستخدم يكتب استعلام حر → اقتراح VIN أو قوائم منسدلة → حفظ Vehicle في حسابه.
2. **عرض المنتج ومؤشر الثقة** : عرض تطابق رقمي، OEM matches، صور، حالة، سعر نهائي مع VAT والشحن.
3. **الدفع** : المستخدم يدفع عبر Stripe/PayPal → إنشاء Order داخلي مع idempotency-key.
4. **تنفيذ شبه آلي** : النظام يجهز سلة الشراء على eBay ويعرض أمر تنفيذ في لوحة Admin للموافقة السريعة أو تنفيذ تلقائي إذا تم تفعيل الأتمتة.
5. **شراء المورد** : تنفيذ الشراء عبر eBay API أو عبر واجهة حساب Buyer مخصص، إدخال عنوان العميل.
6. **استلام تتبع** : استلام trackingNumber من eBay → تحديث Fulfillment → إشعار العميل.
7. **ما بعد البيع** : دعم مرتجعات، سجل تدقيق، تقييم بائع، معالجة نزاعات.

### قواعد مطابقة القطع واحتساب مؤشر الثقة

* **مصادر القواعد** : TecDoc, OEM cross-reference, eBay listing metadata, seller reputation.
* **حساب مؤشر الثقة** : وزن مركب من تطابق VIN fields, OEM match count, seller rating, condition match, historical returns rate.
* **قواعد رفض تلقائي** : إذا كانت سياسة الشحن للبائع تمنع الشحن إلى بلغاريا أو seller rating < threshold.
* **Fallback** : عرض بدائل مرتبة حسب التشابه مع توضيح سبب عدم التطابق.

### متطلبات قانونية ومالية أساسية

* **VAT OSS** : تنفيذ حساب VAT حسب دولة الشحن، إصدار فواتير EU-compliant.
* **سياسة إرجاع 14 يومًا** : عرض واضح وشروط خاصة للقطع الإلكترونية والمستعملة.
* **شروط الخدمة والخصوصية** : بلغارية وإنجليزية، تضمين سياسات معالجة البيانات وحقوق المستهلك.
* **قواعد التعامل مع البائعين** : قائمة بيضاء للبائعين الموثوقين، شروط قبول البائعين، آلية حظر.

### أمن وخصوصية

* **تخزين أسرار** : Vault أو Secrets Manager.
* **توكنات eBay** : تشفير refresh_token، تجديد دوري آمن.
* **حماية المدفوعات** : PCI DSS compliance عبر Stripe.
* **سجلات تدقيق** : لكل قرار مطابقة وتنفيذ شراء.
* **سياسات الوصول** : RBAC للوحة Admin، MFA للمستخدمين الإداريين.

### بنية النشر والتشغيل CI CD

* **حاويات** : Docker لكل خدمة.
* **تنسيق النشر** : Kubernetes managed (GKE/AKS/EKS) أو managed containers.
* **CI** : GitHub Actions لبناء، اختبار، ونشر.
* **IaC** : Terraform لإدارة البنية التحتية.
* **مراقبة** : Prometheus + Grafana + Sentry + ELK.
* **نسخ احتياطي** : نسخ دورية لقاعدة البيانات، خطة استرداد كوارث.

### اختبارات ونوعية الجودة

* **اختبارات وحدات** لكل خدمة.
* **اختبارات تكامل** لعملية البحث، مطابقة VIN، تنفيذ الطلب مع eBay Sandbox.
* **اختبارات أمان** : SAST وDAST قبل النشر.
* **اختبارات تحميل** : محاكاة بحث وطلبات متزامنة.
* **Dry-Run Phase** : أسبوعان محاكاة تنفيذ شبه آلي قبل الأتمتة المالية.

### خارطة طريق تنفيذية موجزة ومراحل زمنية مقترحة

* **المرحلة 0 التحضيرية 0–2 أسابيع** : إعداد حسابات eBay Sandbox/Production، TecDoc access، مستودع Git، Docker, .env template.
* **MVP 3–10 أسابيع** : Next.js frontend basic, API skeleton, VIN parse endpoint, Meilisearch index, import تجريبي لمنتجات eBay، عربة ودفع تجريبي، تنفيذ يدوي.
* **أتمتة التنفيذ 11–16 أسبوعًا** : تنفيذ شبه آلي، لوحة Admin تنفيذية، تجديد توكنات، webhooks.
* **ذكاء ومطابقة متقدمة 17–28 أسبوعًا** : دمج TecDoc، ML للبحث الدلالي، DTC mapping، مؤشر الثقة، اقتراحات جديدة ومستعملة.
* **استقرار وإطلاق Production 29–36 أسبوعًا** : اختبارات أمان، مراجعة VAT، نشر تدريجي، مراقبة، خطة دعم.

### قائمة تسليمات قابلة للتنفيذ على الجذر

* **README.md** هذا الملف.
* **openapi.yaml** يحتوي على spec للـ endpoints الأساسية.
* **.env.example** بقيم المتغيرات المطلوبة.
* **docker-compose.yml** لتشغيل محلي للخدمات الأساسية.
* **repo structure** boilerplate Next.js + NestJS + Docker.
* **GitHub Issues** جاهزة للمراحل الأولى (MVP tasks).
* **Test plan** ملف يحدد حالات الاختبار الأساسية.

### متغيرات بيئة أساسية مثال في .env.example

كتابة تعليمات برمجية

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://user:pass@db:5432/koliparts
REDIS_URL=redis://redis:6379
EBAY_CLIENT_ID=your_client_id
EBAY_CLIENT_SECRET=your_client_secret
EBAY_REDIRECT_URI=https://yourdomain.com/auth/ebay/callback
STRIPE_SECRET_KEY=sk_test_xxx
TECDOC_API_KEY=your_tecdoc_key
VIN_PROVIDER_KEY=your_vin_provider_key
JWT_SECRET=supersecret
SENTRY_DSN=your_sentry_dsn
```

### معايير قبول لكل مرحلة

* **MVP** : بحث يعمل، إدخال VIN يعمل، استيراد منتجات تجريبي، دفع تجريبي، تنفيذ يدوي ممكن.
* **أتمتة** : تنفيذ شبه آلي يعمل من لوحة Admin، تجديد توكنات آمن، استلام trackingNumber.
* **ذكاء** : TecDoc integration مثبتة، مؤشر ثقة يظهر، اقتراحات DTC تعمل، تقارير دقة ≥ 95%.

### مؤشرات الأداء KPI لمراقبة النجاح

* **Conversion Rate** من زيارة صفحة منتج إلى شراء.
* **Order Fulfillment Time** من دفع حتى شراء المورد.
* **Compatibility Accuracy** نسبة التطابق الصحيح.
* **Return Rate** نسبة المرتجعات بسبب عدم توافق.
* **Average Shipping Time** زمن الشحن المتوسط.
* **Seller Reliability Score** متوسط تقييم البائعين المستخدمين.

### توصيات تنفيذية نهائية وملاحظات حرجة

* **ابدأ بTecDoc** لتقليل أخطاء التوافق؛ التكلفة مبررة لتقليل المرتجعات.
* **اعتمد وضع شبه آلي أولًا** لتجنب حظر حسابات eBay وللتحقق من العمليات.
* **صمم النظام بعقود API واضحة** لتسهيل استبدال أي مكوّن لاحقًا.
* **استثمر في بيانات VIN وDTC** لأنها ميزة تنافسية مباشرة.
* **استشر محاسب بلغاري مبكرًا** لضبط VAT وOSS قبل إطلاق الدفع Production.
* **سجل كل قرار مطابقة** لتسهيل حل النزاعات مع العملاء والبائعين.
* **ابدأ بنطاق سوقي محدود** (بلغاريا) ثم وسّع أوروبا تدريجيًا.

### تعليمات للاستخدام مع نموذج برمجي أو فريق تنفيذ

* انسخ هذا الملف إلى جذر المستودع باسم `PROJECT_SPEC.md`.
* اطلب من النموذج أو الفريق قراءة الملف كاملاً ثم توليد: `openapi.yaml`, `docker-compose.yml`, `boilerplate repo` و`GitHub Issues` للمراحل الأولى.
* عند نقل الملف إلى نموذج آخر اطلب منه أولاً إجراء دراسة سوق 2026 محدثة ثم اقتراح إضافات وظيفية وتقنية بناءً على الوضع التقني الحالي.

### خاتمة صارمة

هذا الملف هو **المصدر الرسمي** لبدء التنفيذ. كل قرار هندسي أو تجاري يجب أن يعود إلى هذا المستند كمرجع أولي. عند أي تعديل جوهري، حدّث هذا الملف واحتفظ بسجل التغييرات. ابدأ الآن بنسخ الملف إلى جذر المستودع باسم **PROJECT_SPEC.md** واطلب من النموذج أو الفريق توليد الملفات التنفيذية المذكورة أعلاه.
