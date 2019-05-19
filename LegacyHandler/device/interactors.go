package device

type Extractor struct {
	ExtractionRecipe int     `json:"extraction_recipe"`
	Details          Details `json:"details"`
	State            *State  `json:"state`
}

type Inserter struct {
	InsertionRecipe int     `json:"insertion_recipe"`
	Details         Details `json:"details"`
	State           *State  `json:"state`
}

type Details struct {
	FilePath       string `json:"file_path"`
	Row            int    `json:"row"`
	Register       int    `json:"register"`
	UserName       string `json:"username"`
	PasswordEnvVar string `json:"pwd_env"`
	Password       string `json:"pwd"`
	Table          string `json:"table"`
}

func (e Extractor) Get() {
	// would get data according to a recipe
}

func (i Inserter) Set() {
	// would set data according to a recipe
}
