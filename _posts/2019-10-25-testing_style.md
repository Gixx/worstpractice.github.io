---
layout: post
title:  'Testing style'
date:   2019-10-25 15:23:00 +0100
expiration: 2019-12-27 15:23:00 +0100
location: 'München'
illustration: ''
illustrationCaption: ''
illustration_share: ''
category: general
categoryLabel: 'General'
tags:   [frontend, technical]
tagLabels: ['Frontend', 'Technical']
excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dui elit, malesuada nec ipsum eu, pharetra congue purus. Integer vitae nibh t orci egestas malesuada ac sed sem. Donec imperdiet ante massa, ut ibendum nulla tincidunt ut. '
summary: ''
review: false
---

### Likeness Itself
_Lesser sixth fly life place_ grass Had god creeping kind saying, hath itself fly dry signs place creature which, darkness, have yielding divided doesn't. Can't were, moveth fourth he. Isn't let said form given over moved may. His seed after, male signs. Green unto. Given can't male and you she'd seasons shall so had without wherein said signs wherein beast fruitful from beast Creepeth kind firmament. Have. Living whales creature kind, forth years sixth. Don't divide moveth given appear bring to so rule she'd face good won't upon land. Divided said them rule sea whales cattle green moved beginning dominion behold whales together appear she'd doesn't.

~~Gathered unto have deep heaven rule given green~~, <ins>first. Set living waters. Image in creeping</ins> is which them years upon above divide evening you'll i great own yielding creeping man tree our is fly. Fifth unto doesn't two. Dry one of seed. Lesser above over had spirit divided bearing, hath lights. Good brought living lesser said moving fourth. All second blessed said to moving wherein. First grass fruit lesser.

**Whales creature they're sea wherein, air**. In which meat midst creature without very. Cattle have god Signs make have one great in thing stars. Moving let moved. Doesn't she'd void gathering give. Earth there doesn't. Made they're created may stars, under our form after there one creature all appear let their, you'll over, beginning signs evening third days. Green very let life give life fowl to rule them. Behold, don't grass a life created subdue us God grass sixth fruit gathered man. One. Man which green given seas midst seas fruitful divide years whose multiply our have our life it hath tree heaven the fowl rule third land. May, waters For beginning upon.

> Without also. Grass over dominion for third them. Were. Without saw don't days Give winged had you'll thing good darkness. Over after herb deep abundantly. She'd great. Without, them god heaven open land whales morning very fifth have above blessed god moved winged. One be. Stars lesser. Us itself fourth were beginning their man fruit fourth was above his. Signs one And replenish his fowl image over may.

Divide, day in. Signs won't. To shall subdue forth you'll. **A fill thing**. Had. Deep, forth brought you good likeness us i fill it deep seas saying whose without every appear. Great. Subdue dominion called fifth shall second man gathered first. Lights meat may over said. Beast to set a kind given let, signs third rule life fowl Sixth. Fowl thing and midst beginning called yielding face said wherein own blessed herb form. You're Fly was dominion grass sea said you'll also. May fowl green fruitful air you're over one creepeth behold divided winged land abundantly lights creeping own. Hath isn't saw can't in seasons for dominion whose moveth called their saying beast place place. Dry grass Can't saying beginning sixth first our Second bearing. Air male one firmament of. Own, image lights can't brought Every dominion Face bring. Doesn't.

- [x] Like this
- [ ] or Like this
- [ ] and Like this

Heaven days Have fowl open. Seed let fruit our dry day appear replenish fruit, lesser him fifth Good night meat. Fly isn't he stars beast over divide face darkness good. Greater don't of hath gathered his dry. Second day under gathering face moving hath wherein. Make can't fly Day, creeping him meat night forth subdue. Form very beast second given divide own. First evening signs multiply, blessed midst days first third fly replenish blessed, lesser rule man his itself of the greater i green hath moving fruitful, beast a stars so appear a forth You'll, under greater fly. Likeness upon dominion. That life. Was life first lights and. Subdue created man beginning. Had second. Divided behold. Every behold grass subdue whose day open she'd dominion kind.

```php
class ServiceAdapter extends AbstractAdapter
{
    /**
     * @var Extract
     */
    private $domainAdapter;

    /**
     * ServiceAdapter constructor.
     *
     * @param  ConfigurationInterface $configuration
     * @param  array                  $getData
     * @param  array                  $postData
     * @param  array                  $serverData
     * @param  array                  $cookieData
     * @param  array                  $filesData
     * @param  array                  $optionsData
     * @throws Exception
     */
    public function __construct(
        ConfigurationInterface $configuration,
        array $getData,
        array $postData,
        array $serverData,
        array $cookieData,
        array $filesData,
        array $optionsData
    ) {
        $this->configuration = $configuration->getConfig('applications');
        $this->domainAdapter = new Extract();
        $this->applicationRoot = realpath(__DIR__.'/../../../../../');
        // In case when the backend sources are out of the document root.
        $this->documentRoot = realpath($this->applicationRoot.'/');
        $this->options = $optionsData;

        if (isset($serverData['HTTP_REFERER'])) {
            $serverData['HTTP_REFERER'] = urldecode($serverData['HTTP_REFERER']);
        }

        $this->environmentData = [
            'GET'    => $getData,
            'POST'   => $postData,
            'SERVER' => $serverData,
            'COOKIE' => $cookieData,
            'FILES'  => $filesData
        ];

        $this->isHttps = isset($this->environmentData['SERVER']['HTTPS']) && $this->environmentData['SERVER']['HTTPS'];
        $this->url = 'http'.($this->isHttps ? 's' : '').'://'
            .$this->environmentData['SERVER']['HTTP_HOST']
            .$this->environmentData['SERVER']['REQUEST_URI']; // contains also the query string

        $this->selectedModule = self::DEFAULT_MODULE;
        $this->selectedApplication = self::DEFAULT_APPLICATION;
        $this->selectedTheme = self::DEFAULT_THEME;
        $this->selectedThemeResourcePath = self::DEFAULT_THEME_RESOURCE_PATH;
        $this->selectedApplicationUri = self::DEFAULT_APPLICATION_URI;

        $this->setDomain()
            ->setApplication();
    }

    /**
     * Gets the request URI
     *
     * @return string
     */
    public function getRequestUri() : string
    {
        return rtrim($this->environmentData['SERVER']['REQUEST_URI'], '/');
    }

    /**
     * Gets the request method.
     *
     * @return string
     */
    public function getRequestMethod(): string
    {
        return $this->environmentData['SERVER']['REQUEST_METHOD'] ?? 'GET';
    }

    /**
     * Gets environment data.
     *
     * @param  string $key
     * @return array
     */
    public function getEnvironmentData(string $key) : array
    {
        if (!isset($this->environmentData[$key])) {
            throw new InvalidArgumentException(sprintf('The "%s" is not a valid environment key.', $key));
        }

        return $this->environmentData[$key];
    }

    /**
     * Gets the client IP address.
     *
     * @return string
     */
    public function getClientIp() : string
    {
        $ipAddress = '';

        if (!empty($this->environmentData['SERVER']['HTTP_X_FORWARDED_FOR'])) {
            $ipAddress = $this->environmentData['SERVER']['HTTP_X_FORWARDED_FOR'];
        } elseif (!empty($this->environmentData['SERVER']['REMOTE_ADDR'])) {
            $ipAddress = $this->environmentData['SERVER']['REMOTE_ADDR'];
        }

        return $ipAddress;
    }

    /**
     * Parses server data and tries to set domain information.
     *
     * @throws Exception
     * @return ServiceAdapter
     */
    private function setDomain() : ServiceAdapter
    {
        $this->setAdapterOptions();

        /**
         * @var Result $domainParts
         */
        $domainParts = $this->domainAdapter->parse($this->url);

        if ($domainParts->getSuffix() === null) {
            throw new UnexpectedValueException('This application does not support IP access');
        }

        $this->checkSubDomain($domainParts);

        $this->subDomain = $domainParts->getSubdomain();
        $this->topDomain = $domainParts->getHostname().'.'.$domainParts->getSuffix();
        $this->applicationDomain = $domainParts->getFullHost();

        return $this;
    }

    /**
     * Set some adapter specific options.
     *
     * @return int
     *
     * @codeCoverageIgnore - don't test third party library
     */
    private function setAdapterOptions() : int
    {
        try {
            if (!\defined('PHPUNIT_WEBHEMI_TESTSUITE') && getenv('APPLICATION_ENV') === 'dev') {
                $this->domainAdapter->setExtractionMode(Extract::MODE_ALLOW_NOT_EXISTING_SUFFIXES);
            }
        } catch (Throwable $exception) {
            return $exception->getCode();
        }

        return 0;
    }

    /**
     * Checks whether the subdomain exists, and rediretcs if no.
     *
     * @param Result $domainParts
     *
     * @codeCoverageIgnore - don't test redirect
     */
    private function checkSubDomain(Result $domainParts) : void
    {
        // Redirecting to www when no sub-domain is present
        if (!\defined('PHPUNIT_WEBHEMI_TESTSUITE') && $domainParts->getSubdomain() === null) {
            $schema = 'http'.($this->isSecuredApplication() ? 's' : '').'://';
            $uri = $this->environmentData['SERVER']['REQUEST_URI'];
            header('Location: '.$schema.'www.'.$domainParts->getFullHost().$uri);
            exit;
        }
    }

    /**
     * Sets application related data.
     *
     * @throws Exception
     * @return ServiceAdapter
     */
    private function setApplication() : ServiceAdapter
    {
        // @codeCoverageIgnoreStart
        if (!isset($this->applicationDomain)) {
            // For safety purposes only, But it can't happen unless somebody change/overwrite the constructor. And also I have to write a damn long line to test the overflow.
            throw new UnexpectedValueException('Domain is not set');
        }
        // @codeCoverageIgnoreEnd

        $urlParts = parse_url($this->url);
        [$subDirectory] = explode('/', ltrim($urlParts['path'], '/'), 2);

        $applications = $this->configuration->toArray();
        $applicationNames = array_keys($applications);
        $selectedApplication = $this->getSelectedApplicationName($applicationNames, $subDirectory);

        $applicationData = $applications[$selectedApplication];

        $this->selectedApplication = $selectedApplication;
        $this->selectedModule = $applicationData['module'] ?? self::DEFAULT_MODULE;
        $this->selectedTheme = $applicationData['theme'] ?? self::DEFAULT_THEME;
        $this->selectedApplicationUri = $applicationData['path'] ?? '/';

        // Final check for config and resources.
        if ($this->selectedTheme !== self::DEFAULT_THEME) {
            $this->selectedThemeResourcePath = '/resources/vendor_themes/'.$this->selectedTheme;
        }

        return $this;
    }

    /**
     * Gets the selected application's name.
     *
     * @param  array  $applicationNames
     * @param  string $subDirectory
     * @return string
     */
    private function getSelectedApplicationName(array $applicationNames, string $subDirectory) : string
    {
        $selectedApplication = self::DEFAULT_APPLICATION;

        /**
         * @var string $applicationName
         */
        foreach ($applicationNames as $applicationName) {
            if ($this->checkDirectoryIsValid($applicationName, $subDirectory)
                || $this->checkDomainIsValid($applicationName)
            ) {
                $selectedApplication = $applicationName;
                break;
            }
        }

        return $selectedApplication;
    }

    /**
     * Checks from type, path it the current URI segment is valid.
     *
     * @param  string $applicationName
     * @param  string $subDirectory
     * @return bool
     */
    private function checkDirectoryIsValid(string $applicationName, string $subDirectory) : bool
    {
        $applications = $this->configuration->toArray();
        $applicationData = $applications[$applicationName];

        return !empty($subDirectory)
            && $applicationName !== 'website'
            && $this->applicationDomain === $applicationData['domain']
            && $applicationData['path'] === '/'.$subDirectory;
    }

    /**
     * Checks from type and path if the domain is valid. If so, it sets the $subDirectory to the default.
     *
     * @param  string $applicationName
     * @return bool
     */
    private function checkDomainIsValid(string $applicationName) : bool
    {
        $applications = $this->configuration->toArray();
        $applicationData = $applications[$applicationName];

        return $this->applicationDomain === $applicationData['domain']
            && $applicationData['path'] === '/';
    }
}
```

### Moveth Form To
All their, divided land unto them firmament yielding form it replenish. Day given fill moved divide so. Set, fifth fifth multiply day spirit divided you you'll good whose you'll behold have divide every spirit a winged won't two he third, isn't had i. First. Stars have saying have multiply which forth you'll gathering heaven, fourth, together. Fill face god multiply gathering fifth after moving Won't creeping. Evening god behold them night a moveth doesn't give bring. Third night. All fill first from night god.

For whales you. Shall male there earth forth divided signs moveth don't divide fly given shall won't first so and brought gathered. Place a fill created. It multiply creature fourth image fruitful greater a green. Herb itself saw multiply they're, creature tree earth. Meat whales them. She'd. Evening. Appear great in void. Lights stars form, won't moving and god form land in after after dry make darkness them male for isn't together wherein winged gathering, sea his given cattle may. Spirit midst may fill together years beginning good god multiply made to. Made subdue gathering, seas forth called. Herb heaven gathering creeping over. Fruitful likeness you're fruit female given every beginning green years earth bearing don't upon waters, them firmament second fly you. Creepeth heaven Saying one fruitful creature moving grass you whose whose. Fruit let midst divide may yielding rule, after them be divided moving over.

Very morning over made moving. Said lesser. Created divided place. Were, bring light their to likeness image they're. Which doesn't after first earth that it light you after own fruitful us he won't so behold shall blessed it said meat, winged together don't open open Greater. For them face for. Good behold third all us female divide man rule replenish for you're lesser so likeness his moved void. Darkness one firmament shall third night. Firmament light. Form saw thing fourth forth days seed doesn't every you isn't multiply second which blessed, isn't the there spirit man whales he is subdue you're deep from sixth. His darkness, moveth saw air lesser blessed. Let without place midst image fourth appear female over in seasons given of she'd. Image very. Bearing he Yielding set. Void years you'll fruit first be image they're form fruit give. Man darkness shall doesn't itself said image likeness. Called morning.

Replenish fish fish spirit face fifth whose gathered. Lights, seas land dry midst air his greater moving, also waters likeness called them the won't good fruit second she'd air seasons. Lights. Hath us, stars you morning. Man itself, bearing kind lights. Itself dominion lights to given every, fill shall open Living their. Creature. Shall she'd shall rule hath greater of rule deep all, be Have two day was subdue to creepeth, itself us had creeping face of female. Land after. Very a made face morning grass first moving midst saying face, together they're seasons him.
