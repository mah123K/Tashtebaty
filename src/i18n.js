// ===============================
// src/i18n.js
// ===============================

import { createI18n } from "vue-i18n";
const messages = {
  ar:{
  "navbar": {
    "home": "الرئيسية",
    "services": "الخدمات",
    "plumbing": "سباكة",
    "electrical": "كهرباء",
    "finishing": "تشطيبات",
    "carpentry": "نجارة",
    "offers": "العروض",
    "about": "من نحن",
    "contact": "اتصل بنا",
    "hello": "مرحباً، {name}",
    "manageProfile": "إدارة حسابك",
    "switchAccount": "تبديل الحساب",
    "logout": "تسجيل الخروج",
    "signup": "إنشاء حساب",
    "login": "تسجيل الدخول",
    "myOrders": "طلباتي",
    "notifications": "الإشعارات",
    "noNotifications": "لا توجد إشعارات بعد",
    "myOrdersTitle": "طلباتي"
  },
  "footer": {
    "description": "تأسست 'تشطيباتي' لتبسيط خدمات الصيانة المنزلية لكل أسرة في مصر عبر ربط المستخدمين بفنيين ماهرين وموثوقين.",
    "quickLinks": "روابط سريعة",
    "legal": "الشؤون القانونية",
    "contactUs": "اتصل بنا",
    "links": {
      "about": "من نحن",
      "contact": "اتصل بنا",
      "services": "الخدمات",
      "offers": "العروض",
      "terms": "شروط الاستخدام",
      "privacy": "سياسة الخصوصية",
      "cookie": "سياسة ملفات الارتباط"
    }
  },
  "forgotPassword": {
    "title": "إعادة ضبط كلمة المرور",
    "prompt": "أدخل بريدك الإلكتروني لتحصل على رابط إعادة التعيين.",
    "emailPlaceholder": "أدخل بريدك الإلكتروني",
    "button": "إرسال رابط إعادة التعيين",
    "sending": "جارٍ الإرسال...",
    "backToLogin": "العودة لتسجيل الدخول"
  },
  "home": {
    "services": {
      "title": "خدماتنا",
      "plumbing": "سباكة",
      "finishing": "تشطيبات",
      "electrical": "كهرباء",
      "carpentry": "نجارة"
    },
    "howItWorks": {
  "title": "خطوات عملنا",
  "subtitle": "احجز خدمات الصيانة المنزلية الموثوقة في أربع خطوات بسيطة.",
  "step1": {
    "title": "تصفح الخدمات",
    "text": "استكشف الأقسام مثل السباكة، الكهرباء، وغيرها."
  },
  "step2": {
    "title": "احجز الفني",
    "text": "اختر فنيًا موثوقًا وحدد الوقت والمكان."
  },
  "step3": {
    "title": "ادفع بأمان",
    "text": "ادفع عبر باي موب أو نقدًا؛ وتابع طلبك بسهولة."
  },
  "step4": {
    "title": "تم التنفيذ والتقييم",
    "text": "يُكمل الفني المهمة، وأنت تؤكد وتقيّم الخدمة."
  }
    },
    "offers": {
      "title": "عروض حصرية",
      "seeMore": "عرض المزيد",
      "loading": "جار تحميل العروض...",
      "claim": "احصل على العرض",
      "noOffers": "لا توجد عروض متاحة حالياً."
    },
    "whyUs": {
      "title": "لماذا تختارنا؟",
      "point1": "لقد خدمنا أكثر من 60,000 عميل سعيد وما زالوا يطلبون خدماتنا بانتظام.",
      "point2": "أسعار مرنة، اختر السعر المناسب لك وتفاوض.",
      "point3": "جميع العمال والفنيين متعاقدون معنا وجميع بياناتهم متاحة بالكامل.",
      "point4": "متابعة مستمرة أثناء وحتى اكتمال تنفيذ الطلب."
    },
    "feedback": {
      "title": "آراء عملائنا",
      "name": "اسم العميل"
    },
    "gallery": {
      "title": "معرض أعمالنا",
      "description": "ألق نظرة على بعض مشاريعنا المكتملة - من الإصلاحات المنزلية إلى التجديدات الكاملة. يتم التعامل مع كل مشروع بعناية ودقة وجودة."
    },
    "contactInfo": {
      "phone": "الهاتف",
      "email": "البريد الإلكتروني",
      "address": "العنوان"
    }
  },
    "aboutUs": {
    "hero": {
      "title": "عن تشطيباتي",
      "subtitle": "نحن نقدم أعلى مستويات الجودة بأفضل الأسعار في السوق",
      "description": "منصة مصرية رائدة تأسست عام 2025 على يد خمسة مؤسسين اتحدوا لهدف واحد: تبسيط الوصول إلى أفضل خدمات الصيانة المنزلية والخدمات المهنية في مصر. وُلدت 'تشطيباتي' من إيماننا بضرورة بناء جسر من الثقة والاحترافية بين عملائنا الكرام وأمهر الحرفيين والفنيين."
    },
    "features": {
      "title": "ما يميزنا",
      "subtitle": "نحن لا نصلح المنازل فحسب، بل نقدم تجربة متكاملة.",
      "feature1Title": "فنيون معتمدون",
      "feature1Text": "يتمتع كل محترف بمهارات عالية ويتم التحقق منه، وهو متخصص في مهنته بالضبط - لا يوجد لدينا عمال 'متعددي المهام'. تحصل على خبير حقيقي في كل مرة.",
      "feature2Title": "دعم فني 24/7",
      "feature2Text": "احصل على استجابة فورية ومساعدة مخصصة من فريق الدعم لدينا، مما يضمن تتبع مشكلتك ومعالجتها على مدار الساعة، من البداية إلى النهاية.",
      "feature3Title": "سياسة تسعير شفافة",
      "feature3Text": "لا رسوم خفية أو تكاليف مفاجئة. نحن نقدم تقديرات واضحة ومفصلة قبل بدء أي عمل، حتى تعرف دائمًا ما تدفع مقابله."
    },
    "stats": {
      "services": "خدمة مكتملة",
      "users": "مستخدم مسجل",
      "orders": "طلبات متكررة",
      "rating": "متوسط التقييم"
    },
    "whyUs": {
      "title": "لماذا تختارنا؟",
      "description": "تشطيباتي هي منصتك المصرية الموثوقة، التي تحل مشكلة العثور على مساعدة موثوقة منذ عام 2025. نحن ندقق ونتعاقد بدقة مع كل محترف، من الإصلاحات السريعة (السباكة، الكهرباء) إلى تشطيبات المنزل الكاملة. نحن نضمن صنعة خبيرة، وأسعار واضحة، ودعم مستمر من الطلب حتى الاكتمال، مما يضمن راحة البال التامة مع كل خدمة.",
      "point1": "استخدام أفضل المواد والعمالة في كل مشروع.",
      "point2": "النزاهة والأمانة من القمة إلى القاعدة.",
      "point3": "أسعار معقولة وعادلة.",
      "point4": "مرخص ومؤمن عليه.",
      "point5": "نهتم بعملائنا ونقدم اهتمامًا شخصيًا."
    },
    "feedback": {
      "title": "آراء عملائنا",
      "samir": {
        "name": "سمير محمد",
        "text": "القاطع الرئيسي كان يفصل باستمرار، وكان هذا مزعجًا للغاية. استخدمت تشطيباتي وتم إرسال كهربائي بسرعة لا تصدق. أعجبتني الشفافية في هيكل الرسوم قبل أن يبدأ الإصلاح. أصلح مشكلة الأسلاك بسرعة واحترافية، وكانت متابعة النظام ممتازة. أشعر بأمان أكبر الآن. إذا كنت بحاجة إلى سرعة ومساعدة جديرة بالثقة، فهذه هي الخدمة التي يجب استخدامها!"
      },
      "mona": {
        "name": "منى عادل",
        "text": "أخيرًا قررت تحديث خزائن مطبخي، وحجزت نجارًا عبر تشطيباتي. لقد تأثرت كثيرًا! كانت جودة العمل من الدرجة الأولى، وتم توفير بيانات الفني بشفافية مقدمًا. كان السعر رائعًا، وانتهوا قبل الموعد المحدد. معرفتي بأنهم يتواصلون للمتابعة بعد الانتهاء يوضح أنهم يهتمون حقًا. هذه هي خدمتي المفضلة الجديدة لصيانة المنزل. أوصي بها بشدة!"
      },
      "mai": {
        "name": "مي طارق",
        "text": "أوصي بشدة بتطبيق تشطيباتي لخدمة موثوقة وعالية الجودة."
      },
      "khaled": {
        "name": "خالد نبيل",
        "text": "كنت بحاجة إلى سباك لتسريب عاجل، واستخدمت تشطيباتي لأول مرة. كانت العملية سلسة بشكل لا يصدق. أحببت أن جميع معلومات السباك كانت موجودة بوضوح! كان السعر عادلاً، وكانت مكالمة المتابعة بعد انتهاء العمل لمسة رائعة. أنا بالتأكيد عميل دائم الآن! أوصي به بشدة للحصول على خدمة موثوقة."
      }
    }
  },
  "contactUs": {
    "header": {
      "title": "اتصل بنا",
      "subtitle": "نحن هنا لمساعدتك في حل مشكلتك"
    },
    "info": {
      "addressTitle": "العنوان",
      "addressText": "مركز بشاير، الجيزة",
      "phoneTitle": "الهاتف",
      "phoneText": "+201234567890",
      "emailTitle": "البريد الإلكتروني",
      "emailText": "example@gmail.com"
    },
    "form": {
      "title": "اكتب لنا رأيك",
      "placeholderName": "الاسم",
      "placeholderEmail": "بريدك الإلكتروني",
      "placeholderPhone": "رقم هاتفك",
      "placeholderSubject": "الموضوع",
      "placeholderMessage": "اكتب رسالتك...",
      "submitButton": "إرسال",
      "success": "تم إرسال رسالتك بنجاح!",
      "errorRequired": "يرجى ملء جميع الحقول المطلوبة",
      "errorGeneral": "حدث خطأ ما. يرجى المحاولة مرة أخرى."
    }
  },
  "offersPage": {
    "banner1": {
      "tag": "وقت محدود",
      "title": "سجل الآن واحصل على",
      "subtitle": "قسيمة خصم!",
      "text": "على طلبك الأول!",
      "button": "ابدأ الآن"
    },
    "banner2": {
      "title": "ادع صديقًا",
      "text": "ستحصلون أنتما الاثنان على 100 جنيه رصيد عند حجزه!",
      "subtitle": "لكل صديق",
      "button": "شارك الآن"
    },
    "grid": {
      "loading": "جار تحميل العروض الخاصة...",
      "emptyTitle": "لا توجد عروض متاحة",
      "emptyText": "يرجى التحقق مرة أخرى لاحقًا للعروض الجديدة!",
      "suffix": "خصم",
      "buttonClaiming": "جارٍ...",
      "buttonClaimed": "تم الحصول عليه",
      "buttonClaim": "احصل على العرض"
    }
  },
  "profilesPage": {
    "titleSuffix": "ملفات الفنيين",
    "allProfiles": "كل الملفات الشخصية",
    "loadingError": "فشل تحميل الملفات الشخصية. يرجى المحاولة مرة أخرى.",
    "fallbackLocation": "غير محدد",
    "fallbackBio": "لا يوجد وصف متاح.",
    "fallbackNA": "غير متاح",
    "ordersCompleted": "طلبات مكتملة",
    "viewProfile": "عرض الملف الشخصي"
  },
  "topBar": {
  "filterButton": "تصفية",
  "filtersTitle": "الفلاتر",
  "clearAll": "مسح الكل",
  "searchPlaceholder": "ابحث بالكلمات المفتاحية...",
  "categoryTitle": "الموقع",
  "locations": {
    "cairo": "القاهرة",
    "alexandria": "الإسكندرية",
    "giza": "الجيزة",
    "suez": "السويس",
    "aswan": "أسوان",
    "luxor": "الأقصر",
    "redSea": "البحر الأحمر"
  },
  "projectsTitle": "المشروعات",
  "projects": {
    "few": "عدد قليل من المشروعات (<10)",
    "medium": "عدد متوسط (10–50)",
    "many": "عدد كبير (>50)"
  },
  "ratingTitle": "التقييم",
  "rating": {
    "fiveStars": "٥ نجوم فأعلى",
    "fourStars": "٤ نجوم فأعلى",
    "threeStars": "٣ نجوم فأعلى",
    "twoStars": "نجمتان فأعلى",
    "oneStars": "نجمة فأعلى"
  },
  "resultsText": "عرض {displayed} من أصل {total} نتيجة",
  "sort": {
    "default": "الترتيب الافتراضي",
    "ratingDesc": "التقييم (من الأعلى إلى الأدنى)",
    "ratingAsc": "التقييم (من الأدنى إلى الأعلى)",
    "locationClosest": "الموقع (الأقرب أولاً)"
  }
},
  "loginPage": {
    "heroTitle": "بيتك،<br />في رعايتنا",
    "welcome": "مرحبًا بعودتك إلى<br />تشطيباتي",
    "welcomeTitle": "مرحبًا بعودتك إلى<br /><span class=\"text-[#5984C6]\">ت</span>شطيباتي",
    "emailLabel": "البريد الإلكتروني",
    "emailPlaceholder": "أدخل بريدك الإلكتروني",
    "passwordLabel": "كلمة المرور",
    "passwordPlaceholder": "أدخل كلمة المرور",
    "forgotPassword": "هل نسيت كلمة المرور؟",
    "signInButton": "تسجيل الدخول",
    "divider": "أو المتابعة باستخدام",
    "googleButton": "تسجيل الدخول باستخدام جوجل",
    "promptSignup": "ليس لديك حساب؟",
    "signupLink": "إنشاء حساب",
    "errors": {
      "notFoundDB": "المستخدم غير موجود في قاعدة البيانات.",
      "notFoundEmail": "لا يوجد مستخدم بهذا البريد الإلكتروني.",
      "wrongPassword": "كلمة المرور غير صحيحة.",
      "generic": "البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى",
      "googleFailed": "فشل تسجيل الدخول باستخدام جوجل.",
      "banned": "تم حظر حسابك من قبل الإدارة. سيتم توجيهك تلقائيًا إلى صفحة التواصل معنا لحل المشكلة",
      "reset": {
        "enterEmail": "يرجى إدخال بريدك الإلكتروني.",
        "sent": "تم إرسال بريد إعادة تعيين كلمة المرور! تحقق من بريدك.",
        "noAccount": "لا يوجد حساب مرتبط بهذا البريد الإلكتروني.",
        "failed": "فشل إرسال بريد إعادة التعيين."
     }
    }
  }, 
  "signUpPage": {
    "title": "إنشاء حساب",
    "subtitle": "أنشئ حسابك وابدأ اليوم",
    "tabs": {
      "client": "عميل",
      "technician": "فني",
      "company": "شركة"
    },
    "client": {
      "title": "تسجيل عميل",
      "profilePic": "صورة الملف الشخصي (اختياري)",
      "fullName": "الاسم بالكامل *",
      "email": "البريد الإلكتروني *",
      "password": "كلمة المرور *",
      "confirmPassword": "تأكيد كلمة المرور *",
      "phone": "رقم الهاتف *",
      "country": "الدولة *",
      "street": "عنوان الشارع *",
      "city": "المدينة *"
    },
    "technician": {
      "title": "تسجيل فني",
      "idCard": "بطاقة الهوية",
      "profilePic": "صورة الملف الشخصي",
      "fullName": "الاسم بالكامل *",
      "username": "اسم المستخدم *",
      "email": "البريد الإلكتروني *",
      "password": "كلمة المرور *",
      "confirmPassword": "تأكيد كلمة المرور *",
      "phone": "رقم الهاتف *",
      "skill": "نوع العمل (مثال: سباكة) *",
      "workArea": "منطقة العمل (المدينة / المنطقة) *",
      "experience": "سنوات الخبرة",
      "address": "العنوان",
      "bio": "نبذة (صف خدمتك)"
    },
    "company": {
      "title": "تسجيل شركة",
      "taxCard": "البطاقة الضريبية",
      "logo": "شعار الشركة",
      "companyName": "اسم الشركة *",
      "username": "اسم المستخدم *",
      "email": "البريد الإلكتروني *",
      "password": "كلمة المرور *",
      "confirmPassword": "تأكيد كلمة المرور *",
      "phone": "الهاتف *",
      "bio": "نبذة (صف شركتك)",
      "address": "العنوان",
      "city": "المدينة",
      "website": "الموقع الإلكتروني / روابط التواصل",
      "teamSize": "حجم الفريق",
      "crn": "رقم السجل التجاري"
    },
    "signUpButton": "إنشاء حساب",
    "promptLogin": "لديك حساب بالفعل؟",
    "loginLink": "سجل الدخول من هنا",
    "alerts": {
      "imageSize": "يجب أن يكون حجم الصورة أقل من 5 ميجابايت",
      "allFields": "يجب ملء جميع الحقول المطلوبة",
      "invalidEmail": "البريد الإلكتروني غير صالح",
      "passwordMismatch": "كلمات المرور غير متطابقة",
      "phoneDigits": "رقم الهاتف يجب أن يحتوي على أرقام فقط",
      "success": "تم التسجيل بنجاح",
      "genericError": "فشل التسجيل. يرجى المحاولة مرة أخرى.",
      "genericErrorWithCode": "فشل التسجيل: {message}"
    }
  },
  "userProfile": {
    "sidebar": {
      "editProfile": "تعديل الملف الشخصي",
      "myOrders": "طلباتي الأخيرة",
      "back": "رجوع"
    },
    "orders": {
      "title": "الطلبات الأخيرة",
      "table": {
        "orderId": "رقم الطلب",
        "date": "التاريخ",
        "status": "الحالة",
        "total": "الإجمالي",
        "actions": "الإجراءات"
      },
      "viewButton": "عرض",
      "totalSales": "إجمالي المبيعات المسلمة:",
      "statusDelivered": "تم التوصيل",
      "statusPending": "قيد الانتظار",
      "statusCancelled": "ملغى" 
    },
    "profile": {
      "title": "المعلومات الشخصية",
      "labels": {
        "name": "الاسم",
        "email": "البريد الإلكتروني",
        "phone": "الهاتف",
        "password": "كلمة المرور",
        "confirmPassword": "تأكيد كلمة المرور"
      }
    },
    "address": {
      "title": "العنوان",
      "labels": {
        "street": "الشارع",
        "city": "المدينة",
        "country": "الدولة"
      },
      "mapNote": "سيتم تحديث موقع الخريطة تلقائيًا بناءً على العنوان",
      "mapUpdating": "جار تحديث موقع الخريطة..."
    },
    "buttons": {
      "save": "حفظ",
      "cancel": "إلغاء"
    },
    "modal": {
      "title": "طلب #{id}",
      "labels": {
        "date": "التاريخ:",
        "status": "الحالة:",
        "total": "الإجمالي:",
        "notes": "ملاحظات:"
      },
      "noNotes": "لا توجد ملاحظات إضافية.",
      "close": "إغلاق",
      "previous": "السابق",
      "next": "التالي"
    },
    "alerts": {
      "passwordMismatch": "كلمات المرور غير متطابقة!",
      "saveSuccess": "تم حفظ التغييرات بنجاح!",
      "saveError": "فشل حفظ التغييرات. يرجى المحاولة مرة أخرى.",
      "imageSize": "يجب أن يكون حجم الصورة أقل من 5 ميجابايت"
    }
   
    },
  "adminDashboard": {
    "sidebar": {
      "title": "إدارة تشطيباتي",
      "dashboard": "لوحة التحكم",
      "users": "العملاء",
      "services": "الخدمات",
      "providers": "مقدمي الخدمات",
      "orders": "الطلبات",
      "payments": "المدفوعات",
      "support": "الدعم",
      "offers": "العروض",
      "logout": "تسجيل الخروج",
      "profileSettings": "إعدادات الملف الشخصي",
      "switchAccount": "تبديل الحساب",
      "lightMode": "الوضع الفاتح",
      "darkMode": "الوضع المظلم",
      "switchToArabic": "العربية",
      "switchToEnglish": "English"
    },
    "dashboard": {
      "title": "نظرة عامة على لوحة التحكم",
      "subtitle": "مراقبة أداء المنصة ومؤشرات الأداء الرئيسية",
      "totalUsers": "إجمالي العملاء",
      "totalCompanies": "إجمالي الشركات",
      "totalCraftsmen": "إجمالي الحرفيين",
      "totalOrders": "إجمالي الطلبات",
      "sinceLastWeek": "منذ الأسبوع الماضي",
      "pendingPrice": "السعر المعلق:",
      "monthlyRevenue": "الإيرادات الشهرية",
      "topRatedProviders": "أفضل مقدمي الخدمات تقييمًا",
      "top5": "أفضل 5",
      "noProviders": "لم يتم العثور على مقدمي خدمات"
    },
    "users": {
      "title": "إدارة العملاء",
      "searchPlaceholder": "البحث عن العملاء...",
      "loading": "جار تحميل العملاء...",
      "profile": "الملف الشخصي",
      "name": "الاسم",
      "phone": "الهاتف",
      "address": "العنوان",
      "email": "البريد الإلكتروني",
      "status": "الحالة",
      "created": "تاريخ الإنشاء",
      "actions": "الإجراءات",
      "active": "نشط",
      "banned": "معلق",
      "pending": "معلق",
      "inactive": "غير نشط",
      "view": "عرض",
      "edit": "تعديل",
      "suspend": "تعليق",
      "reactivate": "إعادة تفعيل",
      "delete": "حذف",
      "deleteUser": "حذف المستخدم",
      "confirmDelete": "هل أنت متأكد من أنك تريد حذف",
      "suspendUser": "تعليق المستخدم",
      "confirmSuspend": "تعليق",
      "reactivateUser": "إعادة تفعيل المستخدم",
      "confirmReactivate": "إعادة تفعيل",
      "editUser": "تعديل المستخدم",
      "saveChanges": "حفظ التغييرات",
      "cancel": "إلغاء",
      "close": "إغلاق",
      "createdLabel": "تاريخ الإنشاء",
      "noClientsYet": "لا يوجد عملاء بعد",
      "noName": "لا يوجد اسم",
      "client": "عميل"
    },
    "orders": {
      "title": "إدارة الطلبات",
      "subtitle": "تتبع وإدارة جميع طلبات الخدمات",
      "allOrders": "جميع الطلبات",
      "searchPlaceholder": "البحث...",
      "filter": "تصفية",
      "orderId": "رقم الطلب",
      "customer": "العميل",
      "service": "الخدمة",
      "provider": "مقدم الخدمة",
      "amount": "المبلغ",
      "date": "التاريخ",
      "time": "الوقت",
      "status": "الحالة",
      "actions": "الإجراءات",
      "completed": "مكتمل",
      "unconfirmed": "غير مؤكد",
      "upcoming": "قادم",
      "new": "جديد",
      "declined": "مرفوض",
      "cancelled": "ملغى",
      "view": "عرض",
      "edit": "تعديل",
      "delete": "حذف",
      "viewModalTitle": "عرض تفاصيل الطلب",
      "editModalTitle": "تعديل الطلب",
      "deleteModalTitle": "تأكيد الحذف",
      "customerLabel": "العميل",
      "serviceLabel": "الخدمة",
      "providerLabel": "مقدم الخدمة",
      "amountLabel": "المبلغ",
      "statusLabel": "الحالة",
      "dateTimeLabel": "التاريخ والوقت",
      "saveChanges": "حفظ التغييرات",
      "deleteConfirmText": "هل أنت متأكد من أنك تريد حذف هذا الطلب؟",
      "cancel": "إلغاء"
    },
    "payments": {
      "title": "إدارة المدفوعات",
      "subtitle": "تتبع جميع المعاملات والمدفوعات",
      "allTransactions": "جميع المعاملات",
      "searchPlaceholder": "البحث...",
      "filter": "تصفية",
      "paymentId": "رقم الدفع",
      "customer": "العميل",
      "orderId": "رقم الطلب",
      "amount": "المبلغ",
      "status": "الحالة",
      "date": "التاريخ",
      "actions": "الإجراءات",
      "completed": "مكتمل",
      "pending": "معلق",
      "failed": "فاشل",
      "view": "عرض",
      "edit": "تعديل",
      "delete": "حذف",
      "viewModalTitle": "تفاصيل الدفع",
      "editModalTitle": "تعديل الدفع",
      "deleteModalTitle": "حذف الدفع",
      "customerLabel": "العميل:",
      "orderLabel": "الطلب:",
      "amountLabel": "المبلغ:",
      "statusLabel": "الحالة:",
      "dateLabel": "التاريخ:",
      "saveChanges": "حفظ التغييرات",
      "deleteConfirmText": "هل أنت متأكد من أنك تريد حذف هذا الدفع؟ لا يمكن التراجع عن هذا.",
      "cancel": "إلغاء",
      "all": "الكل",
      "unconfirmed": "غير مؤكد",
      "upcoming": "قادم",
      "declined": "مرفوض",
      "cancelled": "ملغى",
      "new": "جديد",
      "method": "الطريقة",
      "time": "الوقت",
      "viewTitle": "عرض الدفع",
      "editTitle": "تعديل الدفع",
      "deleteTitle": "تأكيد الحذف",
      "methodLabel": "الطريقة",
      "statuses": {
        "all": "الكل",
        "completed": "مكتمل",
        "unconfirmed": "غير مؤكد",
        "upcoming": "قادم",
        "declined": "مرفوض",
        "cancelled": "ملغى",
        "new": "جديد"
      }
    },

    "services": {
      "title": "فئات الخدمات",
      "subtitle": "إدارة جميع فئات الخدمات المتاحة على منصتك",
      "addCategory": "إضافة فئة",
      "addNewCategory": "إضافة فئة جديدة",
      "categoryName": "اسم الفئة",
      "categoryImage": "صورة الفئة",
      "chooseImage": "اختر صورة",
      "uploading": "جار التحميل...",
      "save": "حفظ",
      "cancel": "إلغاء",
      "status": "الحالة",
      "active": "نشط",
      "inactive": "غير نشط",
      "providers": "مقدمي الخدمات",
      "noProvidersYet": "لا يوجد مقدمي خدمات بعد",
      "viewProviders": "عرض مقدمي الخدمات",
      "edit": "تعديل",
      "delete": "حذف",
      "editService": "تعديل الخدمة",
      "name": "الاسم",
      "image": "الصورة",
      "deleteService": "حذف الخدمة",
      "deleteConfirm": "هل أنت متأكد من أنك تريد حذف هذه الخدمة؟",
      "providersTitle": "مقدمي الخدمات",
      "loadingProviders": "جار تحميل مقدمي الخدمات...",
      "noProviders": "لم يتم العثور على مقدمي خدمات لهذه الخدمة",
      "technician": "فني",
      "company": "شركة",
      "location": "الموقع",
      "about": "حول",
      "experience": "الخبرة",
      "portfolio": "المحفظة",
      "viewPortfolio": "عرض المحفظة",
      "close": "إغلاق"
    },
    "offers": {
      "title": "إدارة العروض",
      "addNewOffer": "إضافة عرض جديد",
      "titleLabel": "العنوان",
      "descriptionLabel": "الوصف",
      "uploadImage": "تحميل الصورة",
      "saving": "جار الحفظ...",
      "addOffer": "إضافة العرض",
      "currentOffers": "العروض الحالية",
      "loading": "جار تحميل العروض...",
      "noOffers": "لم يتم العثور على عروض. أضف واحدة باستخدام النموذج!",
      "delete": "حذف العرض",
      "deleteConfirm": "هل أنت متأكد من أنك تريد حذف هذا العرض؟",
      "fillAllFields": "يرجى ملء جميع الحقول.",
      "errorAddingOffer": "خطأ في إضافة العرض. يرجى المحاولة مرة أخرى.",
      "errorDeletingOffer": "خطأ في حذف العرض. يرجى المحاولة مرة أخرى."
    },

    "adminProfile": {
      "title": "إعدادات ملف المدير",
      "loading": "جار تحميل الملف الشخصي...",
      "name": "الاسم",
      "email": "البريد الإلكتروني",
      "newPassword": "كلمة المرور الجديدة",
      "saveChanges": "حفظ التغييرات",
      "clickToChange": "انقر لتغيير الصورة",
      "clickToAdd": "انقر لإضافة صورة",
      "saving": "جار الحفظ...",
      "success": "تم تحديث الملف الشخصي بنجاح!",
      "error": "فشل في تحديث الملف الشخصي.",
      "removeProfilePicture": "إزالة صورة الملف الشخصي",
      "selectValidImage": "يرجى اختيار ملف صورة صالح.",
      "noFileSelected": "لم يتم اختيار ملف.",
      "imageSizeError": "يجب أن يكون حجم الصورة أقل من 5 ميجابايت.",
      "errorProcessingImage": "خطأ في معالجة الصورة. يرجى المحاولة مرة أخرى.",
      "loginFirst": "يرجى تسجيل الدخول أولاً.",
      "changesSaved": "تم حفظ التغييرات بنجاح!",
      "saveError": "فشل في حفظ التغييرات. يرجى المحاولة مرة أخرى."
    },
 
    "support": {
      "title": "الدعم والشكاوى",
      "subtitle": "إدارة تذاكر الدعم والشكاوى",
      "searchPlaceholder": "البحث في التذاكر...",
      "name": "الاسم",
      "email": "البريد الإلكتروني",
      "phone": "الهاتف",
      "subject": "الموضوع",
      "ticketDate": "تاريخ التذكرة",
      "actions": "رسائل",
      "messageContent": "محتوى الرسالة",
      "close": "إغلاق",
      "loadingTickets": "جار تحميل التذاكر...",
      "noTickets": "لم يتم العثور على تذاكر.",
      "viewMessage": "عرض الرسالة"
    },
    "providers": {
      "title": "إدارة مقدمي الخدمات",
      "searchPlaceholder": "البحث عن مقدم خدمة...",
      "loading": "جار تحميل مقدمي الخدمات...",
      "company": "شركة",
      "craftsmen": "الحرفيين",
      "loadingCompanies": "جار تحميل الشركات...",
      "loadingCraftsmen": "جار تحميل الحرفيين...",
      "allCompanies": "جميع الشركات",
      "allCraftsmen": "جميع الحرفيين",
      "sortByCreated": "ترتيب حسب التاريخ",
      "profile": "الملف الشخصي",
      "companyName": "اسم الشركة",
      "name": "الاسم",
      "email": "البريد الإلكتروني",
      "phone": "الهاتف",
      "address": "العنوان",
      "skill": "المهارة",
      "rating": "التقييم",
      "orders": "الطلبات",
      "created": "تاريخ الإنشاء",
      "status": "الحالة",
      "actions": "الإجراءات",
      "active": "نشط",
      "banned": "محظور",
      "pending": "معلق",
      "view": "عرض",
      "edit": "تعديل",
      "suspend": "تعليق",
      "reactivate": "إعادة تفعيل",
      "delete": "حذف",
      "deleteProvider": "حذف مقدم الخدمة",
      "confirmDelete": "هل أنت متأكد من أنك تريد حذف",
      "suspendProvider": "تعليق مقدم الخدمة",
      "confirmSuspend": "تعليق",
      "reactivateProvider": "إعادة تفعيل مقدم الخدمة",
      "confirmReactivate": "إعادة تفعيل",
      "editProvider": "تعديل مقدم الخدمة",
      "saveChanges": "حفظ التغييرات",
      "cancel": "إلغاء",
      "total": "إجمالي",
      "completed": "مكتمل",
      "deleteModalTitle": "حذف مقدم الخدمة",
      "deleteModalText": "هل أنت متأكد من أنك تريد حذف \"{name}\"؟",
      "suspendModalTitle": "تعليق مقدم الخدمة",
      "suspendModalText": "تعليق \"{name}\" مؤقتًا؟",
      "reactivateModalTitle": "إعادة تفعيل مقدم الخدمة",
      "reactivateModalText": "إعادة تفعيل \"{name}\"؟",
      "viewModalTitle": "عرض تفاصيل مقدم الخدمة",
      "editModalTitle": "تعديل مقدم الخدمة",
      "nameLabel": "الاسم",
      "emailLabel": "البريد الإلكتروني",
      "phoneLabel": "الهاتف",
      "addressLabel": "العنوان",
      "statusLabel": "الحالة",
      "close": "إغلاق",
      "createdLabel": "تاريخ الإنشاء",
      "skillLabel": "المهارة",
      "ratingLabel": "التقييم",
      "ordersLabel": "الطلبات",
      "deleteConfirmText": "هل أنت متأكد من أنك تريد حذف مقدم الخدمة هذا؟",
      "inactive": "غير نشط",
      "delete": "حذف",
      "suspend": "تعليق",
      "reactivate": "إعادة تفعيل",
      "statuses": {
        "active": "نشط",
        "banned": "محظور",
        "pending": "معلق"
      },
      "viewModal": {
        "email": "البريد الإلكتروني",
        "phone": "الهاتف",
        "address": "العنوان",
        "created": "تاريخ الإنشاء",
        "skill": "المهارة",
        "rating": "التقييم",
        "orders": "الطلبات",
        "total": "إجمالي",
        "completed": "مكتمل",
        "idCardImage": "صورة بطاقة الهوية",
        "crnImage": "صورة السجل التجاري",
        "teamSize": "حجم الفريق"
      }
    },
    "serviceCategoryCard": {
      "status": "الحالة",
      "active": "نشط",
      "inactive": "غير نشط",
      "edit": "تعديل",
      "delete": "حذف",
      "viewProviders": "عرض مقدمي الخدمات",
      "providersCount": "مقدمي خدمات",
      "noProvidersYet": "لا يوجد مقدمي خدمات بعد",
      "providersTitle": "مقدمي الخدمات",
      "loadingProviders": "جار تحميل مقدمي الخدمات...",
      "noProviders": "لم يتم العثور على مقدمي خدمات لهذه الخدمة",
      "providerDetails": "تفاصيل مقدم الخدمة",
      "about": "حول",
      "contact": "التواصل",
      "location": "الموقع",
      "experience": "الخبرة",
      "portfolio": "المحفظة",
      "viewPortfolio": "عرض المحفظة",
      "close": "إغلاق",
      "editService": "تعديل الخدمة",
      "name": "الاسم",
      "image": "الصورة",
      "chooseImage": "اختر صورة",
      "uploading": "جار التحميل...",
      "uploadError": "فشل في تحميل الصورة. يرجى المحاولة مرة أخرى.",
      "cancel": "إلغاء",
      "saveChanges": "حفظ التغييرات",
      "deleteService": "حذف الخدمة",
      "deleteConfirm": "هل أنت متأكد من أنك تريد حذف",
      "delete": "حذف",
      "cancel": "إلغاء"
    }
  }
},
en:{
  "navbar": {
    "home": "Home",
    "services": "Services",
    "plumbing": "Plumbing",
    "electrical": "Electrical",
    "finishing": "Finishing",
    "carpentry": "Carpentry",
    "offers": "Offers",
    "about": "About",
    "contact": "Contact Us",
    "hello": "Hello, {name}",
    "manageProfile": "Manage your Profile",
    "switchAccount": "Switch Account",
    "logout": "Log out",
    "signup": "Sign Up",
    "login": "Login",
    "myOrders": "My Orders",
    "notifications": "Notifications",
    "noNotifications": "No notifications yet",
    "myOrdersTitle": "My Orders"
  },
  "footer": {
    "description": "Tashtebaty exists to simplify home maintenance for every household in Egypt by connecting users with skilled, verified technicians.",
    "quickLinks": "Quick Links",
    "legal": "Legal",
    "contactUs": "Contact Us",
    "links": {
      "about": "About us",
      "contact": "Contact",
      "services": "Services",
      "offers": "Offers",
      "terms": "Terms of use",
      "privacy": "Privacy policy",
      "cookie": "Cookie policy"
    }
  },
  "forgotPassword": {
    "title": "Reset Password",
    "prompt": "Enter your email to get a reset link.",
    "emailPlaceholder": "Enter your email",
    "button": "Send Reset Link",
    "sending": "Sending...",
    "backToLogin": "Back to Login"
  },
  "home": {
    "services": {
      "title": "Our Services",
      "plumbing": "Plumbing",
      "finishing": "Finishing",
      "electrical": "Electrical",
      "carpentry": "Carpentry"
    },
    "howItWorks": {
  "title": "Our Working Progress",
  "subtitle": "Book trusted home maintenance in four simple steps.",
  "step1": {
    "title": "Browse Services",
    "text": "Explore categories like plumbing, electrical, etc."
  },
  "step2": {
    "title": "Book a Technician",
    "text": "Choose a verified technician, set time & location."
  },
  "step3": {
    "title": "Pay Securely",
    "text": "Pay online via Paymob or cash; track everything in your order."
  },
  "step4": {
    "title": "Job Done & Rated",
    "text": "Technician completes the task, you confirm & leave a rating."
  }
},
    "offers": {
      "title": "Exclusive Offers",
      "seeMore": "see more",
      "loading": "Loading offers...",
      "claim": "Claim offer",
      "noOffers": "No offers available at the moment."
    },
    "whyUs": {
      "title": "Why Choose US?",
      "point1": "We serve over 60,000 happy customers and they continue to order regularly.",
      "point2": "Flexible prices, choose the price suitable for you and negotiate.",
      "point3": "All workers and technicians are contracted with us and all their data is fully available.",
      "point4": "Continuous follow-up during and until the completion of the order implementation."
    },
    "feedback": {
      "title": "Our Customers Feedback",
      "name": "Customer Name"
    },
    "gallery": {
      "title": "Our Work Gallery",
      "description": "Take a look at some of our completed projects  from home repairs to full renovations. Every project is handled with care, precision, and quality."
    },
    "contactInfo": {
      "phone": "Phone",
      "email": "Email",
      "address": "Address"
    }
  },
  "aboutUs": {
    "hero": {
      "title": "About Tashtebaty",
      "subtitle": "We provide the highest quality with the best Prices in the market",
      "description": "A leading Egyptian platform founded in 2025 by five founders united by a single goal: to simplify access to the best home maintenance and professional services in Egypt. Tashtebaty was born from our belief in the necessity of building a bridge of trust and professionalism between our valued customers and the most skilled craftsmen and technicians."
    },
    "features": {
      "title": "Our special features",
      "subtitle": "We don't just fix homes, we deliver an experience.",
      "feature1Title": "Certified Technicians",
      "feature1Text": "Every professional is highly skilled and verified, specializing in their exact trade—no generalists. You get a true expert every time.",
      "feature2Title": "24/7 Priority Support",
      "feature2Text": "Get an instant response and dedicated assistance from our support team, ensuring your issue is tracked and addressed around the clock, from start to finish.",
      "feature3Title": "Transparent Pricing Policy",
      "feature3Text": "No hidden fees or surprise costs. We provide clear, detailed estimates before any work begins, so you always know what you're paying for."
    },
    "stats": {
      "services": "Completed services",
      "users": "Registered users",
      "orders": "Repeated Orders",
      "rating": "Average rating"
    },
    "whyUs": {
      "title": "Why choose us?",
      "description": "Tashtebaty is your trusted Egyptian platform, solving the hassle of finding reliable help since 2025. We meticulously vet and contract every professional from quick repairs (plumbing, electrics) to full home finishing. We guarantee expert workmanship, clear pricing, and continuous support from order to completion, ensuring total peace of mind with every service.",
      "point1": "Use best materials and labor in every project.",
      "point2": "Integrity and honesty from top to bottom.",
      "point3": "Affordable and fair prices.",
      "point4": "Licensed and Insured.",
      "point5": "We care about our customers and give personal attention."
    },
    "feedback": {
      "title": "Our Customers Feedback",
      "samir": {
        "name": "Samir Mohamed",
        "text": "My main breaker kept tripping, which was a huge hassle. I used Tashtebaty and an electrician was dispatched incredibly fast. I appreciated the clear communication about the fee structure before he started the repair. He fixed the wiring issue quickly and professionally, and the system follow-up was excellent. I feel much safer now. If you need speed and trustworthy help, this is the service to use!"
      },
      "mona": {
        "name": "Mona Adel",
        "text": "I finally decided to get my kitchen cabinets updated, and I booked a carpenter through Tashtebaty. I was so impressed! The quality of the work was top-notch, and the technician's data was transparently provided upfront. The price was great, and they finished ahead of schedule. Knowing they check in after completion shows they really care. This is my new go-to for home maintenance. Highly recommend!"
      },
      "mai": {
        "name": "Mai Tarek",
        "text": "Highly recommend Tashtebaty for reliable and quality work."
      },
      "khaled": {
        "name": "Khaled Nabil",
        "text": "I needed a plumber for an urgent leak, and I used Tashtebaty for the first time. The process was incredibly smooth. I loved that all the plumber's info was right there no guessing! The price was fair, and the follow up call after the job was finished was a fantastic touch. I'm definitely a regular customer now! Highly recommend for reliable service"
      }
    }
  
  },

  "contactUs": {
    "header": {
      "title": "Contact Us",
      "subtitle": "We are here to help you with your issue"
    },
    "info": {
      "addressTitle": "Address",
      "addressText": "Basharim Center, Giza",
      "phoneTitle": "Phone",
      "phoneText": "+201234567890",
      "emailTitle": "Email",
      "emailText": "example@gmail.com"
    },
    "form": {
      "title": "Write a Feedback",
      "placeholderName": "Name",
      "placeholderEmail": "Your email",
      "placeholderPhone": "Your phone",
      "placeholderSubject": "Subject",
      "placeholderMessage": "Write your message...",
      "submitButton": "Submit",
      "success": "Your message has been sent!",
      "errorRequired": "Please fill in all required fields",
      "errorGeneral": "Something went wrong. Please try again."
    }
  },
  "offersPage": {
    "banner1": {
      "tag": "Limited Time",
      "title": "SIGN UP AND GET",
      "subtitle": "DISCOUNT VOUCHER!",
      "text": "on your first order!",
      "button": "Get Started"
    },
    "banner2": {
      "title": "REFER A FRIEND",
      "text": "You both get 100 EGP credit when they book!",
      "subtitle": "FOR EACH",
      "button": "Share Now"
    },
    "grid": {
      "loading": "Loading special offers...",
      "emptyTitle": "No Offers Available",
      "emptyText": "Please check back later for new promotions!",
      "suffix": "off",
      "buttonClaiming": "Claiming...",
      "buttonClaimed": "Claimed",
      "buttonClaim": "Claim Offer"
    }
  },
  "profilesPage": {
    "titleSuffix": "Profiles",
    "allProfiles": "All Profiles",
    "loadingError": "Failed to load profiles. Please try again.",
    "fallbackLocation": "Not specified",
    "fallbackBio": "No bio provided.",
    "fallbackNA": "N/A",
    "ordersCompleted": "Orders Completed",
    "viewProfile": "View Profile"
  },
  "topBar": {
  "filterButton": "Filter",
  "filtersTitle": "Filters",
  "clearAll": "Clear all",
  "searchPlaceholder": "Search keywords...",
  "categoryTitle": "Location",
  "locations": {
    "cairo": "Cairo",
    "alexandria": "Alexandria",
    "giza": "Giza",
    "suez": "Suez",
    "aswan": "Aswan",
    "luxor": "Luxor",
    "redSea": "Red Sea"
  },
  "projectsTitle": "Projects",
  "projects": {
    "few": "Few projects (<10)",
    "medium": "Medium (10–50)",
    "many": "Many (>50)"
  },
  "ratingTitle": "Rating",
  "rating": {
    "fiveStars": "5 Stars & above",
    "fourStars": "4 Stars & above",
    "threeStars": "3 Stars & above",
    "twoStars": "2 Stars & above",
    "oneStars": "1 Star & above"
  },
  "resultsText": "Showing {displayed} of {total} results",
  "sort": {
    "default": "Default sort",
    "ratingDesc": "Rating (High to Low)",
    "ratingAsc": "Rating (Low to High)",
    "locationClosest": "Location (Closest)"
  }
},
 "loginPage": {
    "heroTitle": "Your home,<br />our care",
    "welcomeTitle": "Welcome back to<br /><span class=\"text-[#5984C6]\">T</span>ashteebaty",
    "welcome": "Welcome back!",
    "emailLabel": "Email",
    "emailPlaceholder": "Enter your email",
    "passwordLabel": "Password",
    "passwordPlaceholder": "Enter your password",
    "forgotPassword": "Forgot password?",
    "signInButton": "Sign In",
    "divider": "or continue with",
    "googleButton": "Sign in with Google",
    "promptSignup": "Don't have an account?",
    "signupLink": "Sign up",
    "errors": {
      "notFoundDB": "User not found in database.",
      "notFoundEmail": "No user found with this email.",
      "wrongPassword": "Incorrect password.",
      "generic": "Incorrect email or password Please try again.",
      "googleFailed": "Google Sign-In failed.",
      "banned": "Your account has been banned by the administration. You will be redirected to the Contact Us page to resolve the issue",
      "reset": {
        "enterEmail": "Please enter your email.",
        "sent": "Password reset email sent! Check your inbox.",
        "noAccount": "No account found with this email.",
        "failed": "Failed to send reset email."
      }
    }
  },
  "signUpPage": {
    "title": "Sign Up",
    "subtitle": "Create your account and get started today",
    "tabs": {
      "client": "Client",
      "technician": "Technician",
      "company": "Company"
    },
    "client": {
      "title": "Client Registration",
      "profilePic": "Profile Picture (Optional)",
      "fullName": "Full Name *",
      "email": "Email *",
      "password": "Password *",
      "confirmPassword": "Confirm Password *",
      "phone": "Phone Number *",
      "country": "Country *",
      "street": "Street Address *",
      "city": "City *"
    },
    "technician": {
      "title": "Technician Registration",
      "idCard": "ID Card",
      "profilePic": "Profile Picture",
      "fullName": "Full Name *",
      "username": "Username *",
      "email": "Email *",
      "password": "Password *",
      "confirmPassword": "Confirm Password *",
      "phone": "Phone Number *",
      "skill": "Work type (e.g., Plumbing) *",
      "workArea": "Work Area (City / Region) *",
      "experience": "Years of Experience",
      "address": "Address",
      "bio": "Bio (Describe your service)"
    },
    "company": {
      "title": "Company Registration",
      "taxCard": "Tax Card",
      "logo": "Company Logo",
      "companyName": "Company Name *",
      "username": "Username *",
      "email": "Email *",
      "password": "Password *",
      "confirmPassword": "Confirm Password *",
      "phone": "Phone *",
      "bio": "Bio (Describe your company)",
      "address": "Address",
      "city": "City",
      "website": "Website / Social Links",
      "teamSize": "Team Size",
      "crn": "Company Registration Number (CRN)"
    },
    "signUpButton": "Sign Up",
    "promptLogin": "Already have an account?",
    "loginLink": "Login here",
    "alerts": {
      "imageSize": "Image should be less than 5MB",
      "allFields": "All required fields must be filled",
      "invalidEmail": "The email address is not valid",
      "passwordMismatch": "Passwords do not match",
      "phoneDigits": "Phone number must contain digits only",
      "success": "Registration successful",
      "genericError": "Signup failed. Please try again.",
      "genericErrorWithCode": "Signup failed: {message}"
    }
  },
  "userProfile": {
    "sidebar": {
      "editProfile": "Edit Profile",
      "myOrders": "My Recent Orders",
      "back": "Back"
    },
    "orders": {
      "title": "Recent Orders",
      "table": {
        "orderId": "Order ID",
        "date": "Date",
        "status": "Status",
        "total": "Total",
        "actions": "Actions"
      },
      "viewButton": "View",
      "totalSales": "Total Delivered Sales:",
      "statusDelivered": "Delivered",
      "statusPending": "Pending",
      "statusCancelled": "Cancelled" 
    },
    "profile": {
      "title": "Personal Information",
      "labels": {
        "name": "Name",
        "email": "Email",
        "phone": "Phone",
        "password": "Password",
        "confirmPassword": "Confirm Password"
      }
    },
    "address": {
      "title": "Address",
      "labels": {
        "street": "Street",
        "city": "City",
        "country": "Country"
      },
      "mapNote": "Address will automatically update the map location",
      "mapUpdating": "Updating map location..."
    },
    "buttons": {
      "save": "Save",
      "cancel": "Cancel"
    },
    "modal": {
      "title": "Order #{id}",
      "labels": {
        "date": "Date:",
        "status": "Status:",
        "total": "Total:",
        "notes": "Notes:"
      },
      "noNotes": "No additional notes.",
      "close": "Close", 
      "previous": "Previous",
      "next": "Next" 
    },
    "alerts": {
      "passwordMismatch": "Passwords do not match!",
      "saveSuccess": "Changes saved successfully!",
      "saveError": "Failed to save changes. Please try again.",
      "imageSize": "Image size should be less than 5MB"
    }
  },
    
  "adminDashboard": {
    "sidebar": {
      "title": "Tashtibaty Admin",
      "dashboard": "Dashboard",
      "users": "Users",
      "services": "Services",
      "providers": "Providers",
      "orders": "Orders",
      "payments": "Payments",
      "support": "Support",
      "offers": "Offers",
      "logout": "Logout",
      "profileSettings": "Profile Settings",
      "switchAccount": "Switch Account",
      "lightMode": "Light mode",
      "darkMode": "Dark mode",
      "switchToArabic": "العربية",
      "switchToEnglish": "English"
    },
    "dashboard": {
      "title": "Dashboard Overview",
      "subtitle": "Monitor your platform’s performance and key metrics",
      "totalUsers": "Total Users",
      "totalCompanies": "Total Companies",
      "totalCraftsmen": "Total Craftsmen",
      "totalOrders": "Total Orders",
      "sinceLastWeek": "since last week",
      "pendingPrice": "Pending price:",
      "monthlyRevenue": "Monthly Revenue",
      "topRatedProviders": "Top Rated Providers",
      "top5": "Top 5",
      "noProviders": "No providers found"
    },
    "users": {
      "title": "Client Management",
      "searchPlaceholder": "Search for clients...",
      "loading": "Loading clients...",
      "profile": "Profile",
      "name": "Name",
      "phone": "Phone",
      "address": "Address",
      "email": "Email",
      "status": "Status",
      "created": "Created",
      "actions": "Actions",
      "active": "Active",
      "banned": "Suspended",
      "pending": "Pending",
      "inactive": "Inactive",
      "view": "View",
      "edit": "Edit",
      "suspend": "Suspend",
      "reactivate": "Reactivate",
      "delete": "Delete",
      "deleteUser": "Delete User",
      "confirmDelete": "Are you sure you want to delete",
      "suspendUser": "Suspend User",
      "confirmSuspend": "Suspend",
      "reactivateUser": "Reactivate User",
      "confirmReactivate": "Reactivate",
      "editUser": "Edit User",
      "saveChanges": "Save Changes",
      "cancel": "Cancel",
      "close": "Close",
      "createdLabel": "Created",
      "noClientsYet": "No clients yet",
      "noName": "No name",
      "client": "Client"
    },
    "orders": {
      "title": "Order Management",
      "subtitle": "Track and manage all service orders",
      "allOrders": "All Orders",
      "searchPlaceholder": "Search...",
      "filter": "Filter",
      "orderId": "Order ID",
      "customer": "Customer",
      "service": "Service",
      "provider": "Provider",
      "amount": "Amount",
      "date": "Date",
      "time": "Time",
      "status": "Status",
      "actions": "Actions",
      "completed": "completed",
      "unconfirmed": "unconfirmed",
      "upcoming": "upcoming",
      "new": "new",
      "declined": "declined",
      "cancelled": "cancelled",
      "view": "View",
      "edit": "Edit",
      "delete": "Delete",
      "viewModalTitle": "View Order Details",
      "editModalTitle": "Edit Order",
      "deleteModalTitle": "Delete Confirmation",
      "customerLabel": "Customer",
      "serviceLabel": "Service",
      "providerLabel": "Provider",
      "amountLabel": "Amount",
      "statusLabel": "Status",
      "dateTimeLabel": "Date & Time",
      "saveChanges": "Save Changes",
      "deleteConfirmText": "Are you sure you want to delete this order?",
      "cancel": "Cancel"
    },
    "payments": {
      "title": "Payment Management",
      "subtitle": "Track all transactions and payments",
      "allTransactions": "All Transactions",
      "searchPlaceholder": "Search...",
      "filter": "Filter",
      "paymentId": "Payment ID",
      "customer": "Customer",
      "orderId": "Order ID",
      "amount": "Amount",
      "status": "Status",
      "date": "Date",
      "actions": "Actions",
      "completed": "Completed",
      "pending": "Pending",
      "failed": "Failed",
      "view": "View",
      "edit": "Edit",
      "delete": "Delete",
      "viewModalTitle": "Payment Details",
      "editModalTitle": "Edit Payment",
      "deleteModalTitle": "Delete Payment",
      "customerLabel": "Customer:",
      "orderLabel": "Order:",
      "amountLabel": "Amount:",
      "statusLabel": "Status:",
      "dateLabel": "Date:",
      "saveChanges": "Save Changes",
      "deleteConfirmText": "Are you sure you want to delete this payment? This cannot be undone.",
      "cancel": "Cancel",
      "all": "All",
      "unconfirmed": "Unconfirmed",
      "upcoming": "Upcoming",
      "declined": "Declined",
      "cancelled": "Cancelled",
      "new": "New",
      "method": "Method",
      "time": "Time",
      "viewTitle": "View Payment",
      "editTitle": "Edit Payment",
      "deleteTitle": "Delete Confirmation",
      "methodLabel": "Method",
      "statuses": {
        "all": "All",
        "completed": "Completed",
        "unconfirmed": "Unconfirmed",
        "upcoming": "Upcoming",
        "declined": "Declined",
        "cancelled": "Cancelled",
        "new": "New"
      }
    },
    "providers": {
      "title": "Provider Management",
      "searchPlaceholder": "Search for a provider...",
      "loading": "Loading providers...",
      "company": "Company",
      "craftsmen": "Craftsmen",
      "loadingCompanies": "Loading companies...",
      "loadingCraftsmen": "Loading craftsmen...",
      "allCompanies": "All Companies",
      "allCraftsmen": "All Craftsmen",
      "sortByCreated": "Sort by Created",
      "profile": "Profile",
      "companyName": "Company Name",
      "name": "Name",
      "email": "Email",
      "phone": "Phone",
      "address": "Address",
      "skill": "Skill",
      "rating": "Rating",
      "orders": "Orders",
      "created": "Created",
      "status": "Status",
      "actions": "Actions",
      "active": "Active",
      "banned": "Banned",
      "pending": "Pending",
      "view": "View",
      "edit": "Edit",
      "suspend": "Suspend",
      "reactivate": "Reactivate",
      "delete": "Delete",
      "deleteProvider": "Delete Provider",
      "confirmDelete": "Are you sure you want to delete",
      "suspendProvider": "Suspend Provider",
      "confirmSuspend": "Suspend",
      "reactivateProvider": "Reactivate Provider",
      "confirmReactivate": "Reactivate",
      "editProvider": "Edit Provider",
      "saveChanges": "Save Changes",
      "cancel": "Cancel",
      "total": "total",
      "completed": "Completed",
      "deleteModalTitle": "Delete Provider",
      "deleteModalText": "Are you sure you want to delete \"{name}\"?",
      "suspendModalTitle": "Suspend Provider",
      "suspendModalText": "Suspend \"{name}\" temporarily?",
      "reactivateModalTitle": "Reactivate Provider",
      "reactivateModalText": "Reactivate \"{name}\"?",
      "viewModalTitle": "View Provider Details",
      "editModalTitle": "Edit Provider",
      "nameLabel": "Name",
      "emailLabel": "Email",
      "phoneLabel": "Phone",
      "addressLabel": "Address",
      "statusLabel": "Status",
      "close": "Close",
      "createdLabel": "Created",
      "skillLabel": "Skill",
      "ratingLabel": "Rating",
      "ordersLabel": "Orders",
      "deleteConfirmText": "Are you sure you want to delete this provider?",
      "inactive": "Inactive",
      "delete": "Delete",
      "suspend": "Suspend",
      "reactivate": "Reactivate",
      "statuses": {
        "active": "Active",
        "banned": "Banned",
        "pending": "Pending"
      },
      "viewModal": {
        "email": "Email",
        "phone": "Phone",
        "address": "Address",
        "created": "Created",
        "skill": "Skill",
        "rating": "Rating",
        "orders": "Orders",
        "total": "total",
        "completed": "completed",
        "idCardImage": "ID Card Image",
        "crnImage": "CRN Image",
        "teamSize": "Team Size"
      }
    },
    "services": {
      "title": "Service Categories",
      "subtitle": "Manage all service categories available on your platform",
      "addCategory": "Add Category",
      "addNewCategory": "Add New Category",
      "categoryName": "Category Name",
      "categoryImage": "Category Image",
      "chooseImage": "Choose image",
      "uploading": "Uploading...",
      "save": "Save",
      "cancel": "Cancel",
      "status": "Status",
      "active": "Active",
      "inactive": "Inactive",
      "providers": "providers",
      "noProvidersYet": "No providers yet",
      "viewProviders": "View Providers",
      "edit": "Edit",
      "delete": "Delete",
      "editService": "Edit Service",
      "name": "Name",
      "image": "Image",
      "deleteService": "Delete Service",
      "deleteConfirm": "Are you sure you want to delete this service?",
      "providersTitle": "Providers",
      "loadingProviders": "Loading providers...",
      "noProviders": "No providers found for this service",
      "technician": "Technician",
      "company": "Company",
      "location": "Location",
      "about": "About",
      "experience": "Experience",
      "portfolio": "Portfolio",
      "viewPortfolio": "View Portfolio",
      "close": "Close"
    },
    "offers": {
      "title": "Manage Offers",
      "subtitle": "Manage available offers and discounts",
      "addNewOffer": "Add New Offer",
      "titleLabel": "Title",
      "descriptionLabel": "Description",
      "uploadImage": "Upload Image",
      "saving": "Saving...",
      "addOffer": "Add Offer",
      "currentOffers": "Current Offers",
      "loading": "Loading offers...",
      "noOffers": "No offers found. Add one using the form!",
      "delete": "Delete Offer",
      "deleteConfirm": "Are you sure you want to delete this offer?",
      "fillAllFields": "Please fill in all fields.",
      "errorAddingOffer": "Error adding offer. Please try again.",
      "errorDeletingOffer": "Error deleting offer. Please try again."
    },
    "adminProfile": {
      "title": "Admin Profile Settings",
      "loading": "Loading profile...",
      "name": "Name",
      "email": "Email",
      "newPassword": "New Password",
      "saveChanges": "Save Changes",
      "clickToChange": "Click to change picture",
      "clickToAdd": "Click to add picture",
      "saving": "Saving...",
      "success": "Profile updated successfully!",
      "error": "Failed to update profile.",
      "removeProfilePicture": "Remove profile picture",
      "selectValidImage": "Please select a valid image file.",
      "noFileSelected": "No file selected.",
      "imageSizeError": "Image size should be less than 5MB.",
      "errorProcessingImage": "Error processing image. Please try again.",
      "loginFirst": "Please login first.",
      "changesSaved": "Changes saved successfully!",
      "saveError": "Failed to save changes. Please try again."
    },

    "support": {
      "title": "Support & Complaints",
      "subtitle": "Manage customer support tickets and complaints",
      "searchPlaceholder": "Search tickets...",
      "name": "Name",
      "email": "Email",
      "phone": "Phone",
      "subject": "Subject",
      "ticketDate": "Ticket Date",
      "actions": "Messages",
      "messageContent": "Message Content",
      "close": "Close",
      "loadingTickets": "Loading tickets...",
      "noTickets": "No tickets found.",
      "viewMessage": "View Message"
    },
    "serviceCategoryCard": {
      "status": "Status",
      "active": "Active",
      "inactive": "Inactive",
      "edit": "Edit",
      "delete": "Delete",
      "viewProviders": "View Providers",
      "providersCount": "providers",
      "noProvidersYet": "No providers yet",
      "providersTitle": "Providers",
      "loadingProviders": "Loading providers...",
      "noProviders": "No providers found for this service",
      "providerDetails": "Provider Details",
      "about": "About",
      "contact": "Contact",
      "location": "Location",
      "experience": "Experience",
      "portfolio": "Portfolio",
      "viewPortfolio": "View Portfolio",
      "close": "Close",
      "editService": "Edit Service",
      "name": "Name",
      "image": "Image",
      "chooseImage": "Choose image",
      "uploading": "Uploading...",
      "uploadError": "Failed to upload image. Please try again.",
      "cancel": "Cancel",
      "saveChanges": "Save Changes",
      "deleteService": "Delete Service",
      "deleteConfirm": "Are you sure you want to delete",
      "delete": "Delete",
      "cancel": "Cancel"
    }
  }
}
}
export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.getItem("lang") || "ar",
  fallbackLocale: "en",
  messages
});
// let savedLang = "en";
// try {
//   const stored = localStorage.getItem("lang");
//   if (stored) savedLang = stored;
// } catch (e) {}

// // Load JSON file
// async function loadLocale(lang) {
//   const res = await fetch(`/locals/${lang}.json`);
//   if (!res.ok) {
//     console.error(`❌ Failed to load locale file: /locals/${lang}.json`);
//     return {};
//   }
//   return await res.json();
// }

// export async function createI18nInstance() {
//   const messages = {
//     en: await loadLocale("en"),
//     ar: await loadLocale("ar"),
//   };

//   return createI18n({
//     legacy: false,
//     globalInjection: true,
//     locale: savedLang,
//     fallbackLocale: "en",
//     messages,
//   });
// }
