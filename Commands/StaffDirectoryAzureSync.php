<?php

namespace WebApps\Apps\StaffDirectory\Commands;

use Illuminate\Console\Command;
use WebApps\Apps\StaffDirectory\Controllers\MasterController;

class StaffDirectoryAzureSync extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'StaffDirectory:azure-sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Synchronises mapped Azure Groups and their members for the StaffDirectory App';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        (new MasterController())->syncAzure();
        $this->info('Azure Users & Groups synchronised successfully');
        return 0;
    }
}
